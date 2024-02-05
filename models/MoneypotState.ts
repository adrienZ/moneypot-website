import type {
  Moneypot,
  MoneyPotCategory,
  User
} from "~/server/database/schema/types";

interface IMoneypotData
  extends Pick<
    Moneypot,
    "externalId" | "description" | "title" | "categoryId"
  > {}

interface IMoneypotCategoryData {
  image: MoneyPotCategory["image"];
}

interface ICreatorData
  extends Pick<User, "avatar" | "externalId" | "username"> {}

interface IMoneypotState extends IMoneypotData, IMoneypotCategoryData {
  creator: ICreatorData;
}

export class MoneypotState {
  data: IMoneypotState;

  constructor(data: IMoneypotState) {
    this.data = data;
  }
}
