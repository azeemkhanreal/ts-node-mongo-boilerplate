import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from 'config'

const JWT_SECRET = config.get<string>('jwt.secret')

export default {
  GenerateSalt: async () => {
    return await bcrypt.genSalt(10)
  },
  GenerateHashPassword: async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
  },
  ComparePassword: async (enteredPassword: string, hashedPassword: string, salt: string) => {
    return await bcrypt.hash(enteredPassword, salt) === hashedPassword
  },
  GenerateToken: async (payload: any) => {
    return await jwt.sign(payload, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    })
  },
  VerifyToken: async (token: string) => {
    return await jwt.verify(token, JWT_SECRET)
  }
}
