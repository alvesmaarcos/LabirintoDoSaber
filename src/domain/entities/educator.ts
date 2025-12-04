import { failure, success, Uuid } from "@wave-telecom/framework/core";

interface CreateEducatorProps {
  id?: Uuid;
  createdAt?: Date;
  name: string;
  email: string;
  password: string;
  photoUrl?: string;
}

export class Educator {
  private constructor(
    public readonly id: Uuid,
    public readonly name: string,
    public readonly email: string,
    private _password: string,
    public readonly createdAt: Date,
    private _photoUrl?: string
  ) {}

  static create(props: CreateEducatorProps) {
    return new Educator(
      props.id || Uuid.random(),
      props.name,
      props.email,
      props.password,
      props.createdAt || new Date(),
      props.photoUrl
    );
  }

  get password(): string {
    return this._password;
  }

  get photoUrl(): string | undefined {
    return this._photoUrl;
  }

  updateProfilePicture(photoUrl: string) {
    this._photoUrl = photoUrl;
  }

  updatePassword(newPassword: string) {
    if (this._password == newPassword) {
      return failure("PASSWORD_SAME_AS_OLD");
    }
    this._password = newPassword;
    return success(void 0);
  }
}
