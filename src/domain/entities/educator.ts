import { failure, success, Uuid } from "@wave-telecom/framework/core";

interface CreateEducatorProps {
  id?: Uuid;
  createdAt?: Date;
  name: string;
  email: string;
  password: string;
  photoUrl?: string;
  contact?: string;
}

interface UpdateEducatorProps {
  name?: string;
  contact?: string;
}

export class Educator {
  private constructor(
    public readonly id: Uuid,
    private _name: string,
    private _email: string,
    private _password: string,
    public readonly createdAt: Date,
    private _photoUrl?: string,
    private _contact?: string
  ) {}

  static create(props: CreateEducatorProps) {
    return new Educator(
      props.id || Uuid.random(),
      props.name,
      props.email,
      props.password,
      props.createdAt || new Date(),
      props.photoUrl,
      props.contact
    );
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  get photoUrl(): string | undefined {
    return this._photoUrl;
  }

  get email(): string {
    return this._email;
  }

  get contact(): string | undefined {
    return this._contact;
  }
  update(props: UpdateEducatorProps) {
    this._name = props.name ?? this._name;
    this._contact = props.contact ?? this._contact;
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
