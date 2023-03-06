import z from 'zod'

export interface IUser {
  name: string,
  email: string,
  password: string,
  role: 'user' | 'admin',
  isEmailVerified: boolean,
  salt?: string,
}

const createUser = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required'
    }),
    email: z.string({
      required_error: 'Email is required'
    }),
    password: z.string({
      required_error: 'Password is required'
    }),
    role: z.enum(['user', 'admin']),
    isEmailVerified: z.boolean().optional(),
  }),
  query: z.object({}),
  params: z.object({})
})

const getUser = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    userId: z.string({
      required_error: 'User ID is required'
    })
  })
})

const updateUser = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required'
    }),
    email: z.string({
      required_error: 'Email is required'
    }),
    password: z.string({
      required_error: 'Password is required'
    }),
    role: z.enum(['user', 'admin']),
    isEmailVerified: z.boolean().optional(),
  }),
  query: z.object({}),
  params: z.object({
    userId: z.string({
      required_error: 'User ID is required'
    })
  })
})

const deleteUser = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    userId: z.string({
      required_error: 'User ID is required'
    })
  })
})

export default {
  createUser,
  getUser,
  updateUser,
  deleteUser,
}
