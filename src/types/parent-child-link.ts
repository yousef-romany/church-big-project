import { LinkStatus } from "./enums";
import { User } from "./user";

export type ParentChildLink = {
  id: string;
  status: LinkStatus;
  requestedAt: Date;
  parentId: string;
  parent: User;
  childId: string;
  child: User;
};