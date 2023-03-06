import zod from 'zod';

const login = zod.object({
  body: zod.object({
    email: zod.string().email(),
    password: zod.string().min(6).max(72),
  }),
});

const register = zod.object({
  body: zod.object({
    name: zod.string({
      required_error: 'Name is required',
    }).min(3, {
      message: 'Name must be at least 3 characters',
    }).max(72),
    email: zod.string({
      required_error: 'Email is required',
    }).email(),
    password: zod.string({
      required_error: 'Password is required',
    }).min(6).max(72),
  }),
});

const refreshToken = zod.object({
  body: zod.object({
    refreshToken: zod.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

const logout = zod.object({
  body: zod.object({
    refreshToken: zod.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

const forgotPassword = zod.object({
  body: zod.object({
    email: zod.string({
      required_error: 'Email is required',
    }).email(),
  }),
});

const resetPassword = zod.object({
  body: zod.object({
    token: zod.string({
      required_error: 'Token is required',
    }),
    password: zod.string({
      required_error: 'Password is required',
    }).min(6).max(72),
  }),
});

export default {
  login,
  logout,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
}
