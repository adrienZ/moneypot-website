import type {
  Moneypot,
  MoneyPotCategory,
  User
} from "~/server/database/schema/types";
import { SocialShare } from "./SocialShareUrl";

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

interface IMoneypotShare {
  facebook: string;
  linkedin: string;
  twitter: string;
}

interface IMoneypotConstructorState
  extends IMoneypotData,
    IMoneypotCategoryData {
  creator: ICreatorData;
}

export interface IMoneypotState extends IMoneypotConstructorState {
  share: IMoneypotShare;
}

export class MoneypotState {
  data: IMoneypotState;

  constructor(data: IMoneypotConstructorState) {
    const share = new SocialShare(
      new URL(process.env.BASE_URL + "/moneypot/" + data.externalId),
      data.title
    );

    this.data = {
      ...data,
      share: {
        facebook: share.getFacebookShareUrl(),
        twitter: share.getTwitterShareUrl(),
        linkedin: share.getLinkedinShareUrl()
      }
    };
  }
}
