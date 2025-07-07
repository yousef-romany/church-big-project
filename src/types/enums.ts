export enum Role {
  ADMIN = "ADMIN",
  PRIEST = "PRIEST",
  VISITATION_SERVANT = "VISITATION_SERVANT",
  SUNDAY_SCHOOL_SERVANT = "SUNDAY_SCHOOL_SERVANT",
  PARENT = "PARENT",
  CHILD = "CHILD",
  MAKHDOUM = "MAKHDOUM",
}

export enum FamilyRole {
  FATHER = "FATHER",
  MOTHER = "MOTHER",
  CHILD = "CHILD",
  OTHER = "OTHER",
}

export enum PriestStatus {
  ACTIVE = "ACTIVE",
  STRESSED = "STRESSED",
  SANCTIONED = "SANCTIONED",
}

export enum ServantType {
  VISITATION = "VISITATION",
  SUNDAY_SCHOOL = "SUNDAY_SCHOOL",
}

export enum ServingDay {
  Thursday = "Thursday",
  Friday = "Friday",
}

export enum VisitationStatus {
  URGENT = "URGENT",
  NORMAL = "NORMAL",
  CONTACT_ONLY = "CONTACT_ONLY",
  VISITED = "VISITED",
  NOT_VISITED = "NOT_VISITED",
}

export enum TaskStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export enum BookingStatus {
  BOOKED = "BOOKED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export enum ConfessionStatus {
  UPCOMING = "UPCOMING",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
  CANCELLED = "CANCELLED",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  EXCUSED = "EXCUSED",
}

export enum RecordedBy {
  PRIEST = "PRIEST",
  SERVANT = "SERVANT",
}

export enum ContentType {
  VERSE = "VERSE",
  QUESTION = "QUESTION",
}

export enum LinkStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}