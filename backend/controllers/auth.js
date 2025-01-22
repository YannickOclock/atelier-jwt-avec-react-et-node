import { z } from "zod";
import config from "../config.js";
import { compare, hash } from "../lib/crypto.js";
import { generateAuthenticationToken } from "../lib/tokens.js";
import { User } from "../models/index.js";

// ============================================================
// ====================== USER SIGNUP =========================
// ============================================================

export async function signupUser(req, res) {
  // Body validation
  const { data, error } = await buildSignupBodySchema().safeParseAsync(req.body);
  if (error) { return res.status(400).json({ status: 400, message: error.message }); }

  const { username, email, password } = data;
  
  // Check if email is always in use
  const nbOfUsersWithSameEmail = await User.count({ where: { email }});
  if (nbOfUsersWithSameEmail !== 0) { return res.status(409).json({ status: 409, message: "Provided email already in use" }); }
  
  // Create a new user
  await User.create({
    username,
    email,
    password: await hash(password)
  });

  // Client reponse
  res.status(201).json({ status: 201, message: "User successfully created" });
}

// ============================================================
// ====================== USER SIGNIN =========================
// ============================================================

// ETAPE 2 - LE SERVEUR NODE RECUPERE LA REQUETE ET EFFECTUE LE LOGIN
// GENERATION DES TOKENS (JWT)

export async function loginUser(req, res) {
  // Body validation
  const { data, error } = await buildLoginBodySchema().safeParseAsync(req.body);
  if (error) { return res.status(400).json({ status: 400, message: error.message }); }

  const { email, password } = data;
  
  // Validate user exists and provided password matches
  const user = await User.findOne({ where: { email }});
  if (! user) { return res.status(401).json({ status: 401, message: "Bad credentials" }); }

  const isMatching = await compare(password, user.password);
  if (! isMatching) { return res.status(401).json({ status: 401, message: "Bad credentials" }); }

  // Create authentication tokens
  const { accessToken } = generateAuthenticationToken(user);
  console.log('CSRF TOKEN GENERE PENDANT LA CONNEXION')
  console.log(accessToken)

  // Client reponse
  sendTokensResponse(res, { user, accessToken });
}

// ============================================================
// ===================== LOGOUT USER ==========================
// ============================================================

export async function logout(_, res) {
  res.status(204).json({ status: 204, message: "Successfully logged out"});
}

// ============================================================
// ====================== BODY SCHEMA =========================
// ============================================================

function buildSignupBodySchema() {
  return z.object({
    username: z.string().min(1),
    email: z.string().min(1).email(),
    password: z.string().min(8)
  });
}

function buildLoginBodySchema() {
  return z.object({
    email: z.string().email(),
    password: z.string()
  });
}


// ============================================================
// =================== RESPONSE HANDLING ======================
// ============================================================

function sendTokensResponse(res, { user, accessToken, refreshToken, csrfToken }) {
  // Send reply (to ease client handling)
  res.json({
    username: user.username,
    accessToken: accessToken.token,
    accessTokenType: accessToken.type,
    accessTokenExpiresAt: accessToken.expiresAt,
  });
}
