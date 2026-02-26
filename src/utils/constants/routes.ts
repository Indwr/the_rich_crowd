export const route = Object.freeze({
  index: '/',
  support: '/support',
  dashboard: '/dashboard',

  signIn: '/sign-in',
  signUp: '/sign-up',
  otpSignup: '/otp-signup',
  forgot: '/forgot-password',

  gym: '/gym',
  coach: '/coach',
  parent: '/parent',
  individual: '/individual',

  users: '/users',
  user: '/users/:id',

  childs: '/childs',
  createChild: '/childs/create',
  updateChild: '/childs/:id',

  invites: '/invites',
  createInvite: '/invites/create',

  activities: '/activities',
  activity: '/activities/:id',

  reports: '/reports',

  templates: '/templates',

  settings: '/settings',
  account: '/settings/account',
  changePassword: '/settings/change-password',

  404: '/404',
  '*': '*',
} as const);

export type RouteKeys = keyof typeof route;