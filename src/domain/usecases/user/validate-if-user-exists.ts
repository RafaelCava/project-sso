export interface ValidateIfUserExists {
  validate: (data: ValidateIfUserExists.Params) => Promise<ValidateIfUserExists.Result>
}

export namespace ValidateIfUserExists {
  export type Params = {
    email: string
  }

  export type Result = boolean
}
