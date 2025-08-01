import { Static, TSchema, Type } from "@sinclair/typebox";
import { Result } from "neverthrow";

import { SEGMENT_ID_HEADER, WORKSPACE_ID_HEADER } from "./constants/headers";

export type Present<T> = T extends undefined | null ? never : T;

export type RenameKey<T, K extends keyof T, N extends string> = {
  [P in keyof T as P extends K ? N : P]: T[P];
};

export enum JsonResultType {
  Ok = "Ok",
  Err = "Err",
}

export const JsonOk = <T extends TSchema>(type: T) =>
  Type.Object({
    type: Type.Literal(JsonResultType.Ok),
    value: type,
  });

export const JsonErr = <E extends TSchema>(type: E) =>
  Type.Object({
    type: Type.Literal(JsonResultType.Err),
    err: type,
  });

// necessary because neverthrow's result is not json serializable
export const JsonResult = <T extends TSchema, E extends TSchema>(
  resultType: T,
  errorType: E,
) => Type.Union([JsonOk(resultType), JsonErr(errorType)]);

export const Nullable = <T extends TSchema>(type: T) =>
  Type.Union([type, Type.Null()]);

export const NullableAndOptional = <T extends TSchema>(type: T) =>
  Type.Optional(Type.Union([Type.Null(), type]));

export type JSONValue =
  | string
  | number
  | null
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[];

export const IdOrName = Type.Union([
  Type.Object({
    id: Type.String(),
    name: Type.Optional(Type.String()),
  }),
  Type.Object({
    name: Type.String(),
    id: Type.Optional(Type.String()),
  }),
]);

export type IdOrName = Static<typeof IdOrName>;

export const ResourceTypeEnum = {
  Declarative: "Declarative",
  Internal: "Internal",
} as const;

export const ResourceType = Type.KeyOf(Type.Const(ResourceTypeEnum));

export type ResourceType = Static<typeof ResourceType>;

export enum EventType {
  Identify = "identify",
  Track = "track",
  Page = "page",
  Screen = "screen",
  Group = "group",
  Alias = "alias",
}

export enum InternalEventType {
  MessageSent = "DFInternalMessageSent",
  BadWorkspaceConfiguration = "DFBadWorkspaceConfiguration",
  MessageFailure = "DFMessageFailure",
  MessageSkipped = "DFMessageSkipped",
  SegmentBroadcast = "DFSegmentBroadcast",
  SubscriptionChange = "DFSubscriptionChange",
  EmailDropped = "DFEmailDropped",
  EmailDelivered = "DFEmailDelivered",
  EmailOpened = "DFEmailOpened",
  EmailClicked = "DFEmailClicked",
  EmailBounced = "DFEmailBounced",
  EmailMarkedSpam = "DFEmailMarkedSpam",
  SmsDelivered = "DFSmsDelivered",
  SmsFailed = "DFSmsFailed",
  JourneyNodeProcessed = "DFJourneyNodeProcessed",
  ManualSegmentUpdate = "DFManualSegmentUpdate",
  AttachedFiles = "DFAttachedFiles",
  UserTrackSignal = "DFUserTrackSignal",
  GroupUserAssignment = "DFGroupUserAssignment",
  UserGroupAssignment = "DFUserGroupAssignment",
}

export enum SubscriptionGroupType {
  OptIn = "OptIn",
  OptOut = "OptOut",
}

export const ChannelType = {
  Email: "Email",
  MobilePush: "MobilePush",
  Sms: "Sms",
  Webhook: "Webhook",
} as const;

export const EmailProviderType = {
  SendGrid: "SendGrid",
  AmazonSes: "AmazonSes",
  Resend: "Resend",
  PostMark: "PostMark",
  Smtp: "Smtp",
  Test: "Test",
  MailChimp: "MailChimp",
  Gmail: "Gmail",
} as const;

export const EmailProviderTypeSchema = Type.KeyOf(
  Type.Const(EmailProviderType),
);

export type EmailProviderTypeSchema = Static<typeof EmailProviderTypeSchema>;

export const WorkspaceWideEmailProviderType = {
  SendGrid: EmailProviderType.SendGrid,
  AmazonSes: EmailProviderType.AmazonSes,
  Resend: EmailProviderType.Resend,
  PostMark: EmailProviderType.PostMark,
  Smtp: EmailProviderType.Smtp,
  Test: EmailProviderType.Test,
  MailChimp: EmailProviderType.MailChimp,
} as const;

// Providers that are configured at the workspace level, not the member level.
export const WorkspaceWideEmailProviders = Type.KeyOf(
  Type.Const(WorkspaceWideEmailProviderType),
);

export type WorkspaceWideEmailProviders = Static<
  typeof WorkspaceWideEmailProviders
>;

export enum MobilePushProviderType {
  Firebase = "Firebase",
  Test = "Test",
}

export type ChannelType = (typeof ChannelType)[keyof typeof ChannelType];

export enum SmsProviderType {
  Twilio = "Twilio",
  Test = "Test",
}

export const SubscriptionGroupResource = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  name: Type.String(),
  channel: Type.Enum(ChannelType),
  type: Type.Enum(SubscriptionGroupType),
});

export type SubscriptionGroupResource = Static<
  typeof SubscriptionGroupResource
>;

export const SavedSubscriptionGroupResource = Type.Composite([
  SubscriptionGroupResource,
  Type.Object({
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
  }),
]);

export type SavedSubscriptionGroupResource = Static<
  typeof SavedSubscriptionGroupResource
>;

export interface SegmentUpdate {
  type: "segment";
  segmentId: string;
  currentlyInSegment: boolean;
  segmentVersion: number;
}

export interface UserPropertyUpdate {
  type: "user_property";
  userPropertyId: string;
  value: string;
  userPropertyVersion: number;
}

export type ComputedPropertyUpdate = SegmentUpdate | UserPropertyUpdate;

export enum UserPropertyOperatorType {
  Equals = "Equals",
}

export enum SegmentOperatorType {
  Within = "Within",
  Equals = "Equals",
  HasBeen = "HasBeen",
  NotEquals = "NotEquals",
  Exists = "Exists",
  NotExists = "NotExists",
  GreaterThanOrEqual = "GreaterThanOrEqual",
  LessThan = "LessThan",
}

export enum SegmentHasBeenOperatorComparator {
  GTE = "GTE",
  LT = "LT",
}

export const SegmentHasBeenOperator = Type.Object({
  type: Type.Literal(SegmentOperatorType.HasBeen),
  comparator: Type.Enum(SegmentHasBeenOperatorComparator),
  value: Type.Union([Type.String(), Type.Number()]),
  windowSeconds: Type.Number(),
});

export type SegmentHasBeenOperator = Static<typeof SegmentHasBeenOperator>;

export const SegmentWithinOperator = Type.Object({
  type: Type.Literal(SegmentOperatorType.Within),
  windowSeconds: Type.Number(),
});

export type SegmentWithinOperator = Static<typeof SegmentWithinOperator>;

export const ExistsOperator = Type.Object({
  type: Type.Literal(SegmentOperatorType.Exists),
});

export type ExistsOperator = Static<typeof ExistsOperator>;

export const NotExistsOperator = Type.Object({
  type: Type.Literal(SegmentOperatorType.NotExists),
});

export type NotExistsOperator = Static<typeof NotExistsOperator>;

export const SegmentEqualsOperator = Type.Object({
  type: Type.Literal(SegmentOperatorType.Equals),
  value: Type.Union([Type.String(), Type.Number()]),
});

export type SegmentEqualsOperator = Static<typeof SegmentEqualsOperator>;

export const SegmentNotEqualsOperator = Type.Object({
  type: Type.Literal(SegmentOperatorType.NotEquals),
  value: Type.Union([Type.String(), Type.Number()]),
});

export type SegmentNotEqualsOperator = Static<typeof SegmentNotEqualsOperator>;

export const SegmentGreaterThanOrEqualOperator = Type.Object({
  type: Type.Literal(SegmentOperatorType.GreaterThanOrEqual),
  value: Type.Number(),
});

export type SegmentGreaterThanOrEqualOperator = Static<
  typeof SegmentGreaterThanOrEqualOperator
>;

export const SegmentLessThanOperator = Type.Object({
  type: Type.Literal(SegmentOperatorType.LessThan),
  value: Type.Number(),
});

export type SegmentLessThanOperator = Static<typeof SegmentLessThanOperator>;

export const SegmentOperator = Type.Union([
  SegmentWithinOperator,
  SegmentEqualsOperator,
  SegmentNotEqualsOperator,
  SegmentHasBeenOperator,
  ExistsOperator,
  NotExistsOperator,
  SegmentGreaterThanOrEqualOperator,
  SegmentLessThanOperator,
]);

export type SegmentOperator = Static<typeof SegmentOperator>;

export enum SegmentNodeType {
  Trait = "Trait",
  And = "And",
  Or = "Or",
  Performed = "Performed",
  LastPerformed = "LastPerformed",
  Broadcast = "Broadcast",
  SubscriptionGroup = "SubscriptionGroup",
  Email = "Email",
  Manual = "Manual",
  RandomBucket = "RandomBucket",
  KeyedPerformed = "KeyedPerformed",
  Everyone = "Everyone",
}

export const DBResourceTypeEnum = {
  Declarative: "Declarative",
  Internal: "Internal",
} as const;

export const DBResourceType = Type.KeyOf(Type.Const(DBResourceTypeEnum));

export type DBResourceType = Static<typeof DBResourceType>;

export const SubscriptionGroupSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.SubscriptionGroup),
  id: Type.String(),
  subscriptionGroupId: Type.String(),
  subscriptionGroupType: Type.Enum(SubscriptionGroupType),
});

export type SubscriptionGroupSegmentNode = Static<
  typeof SubscriptionGroupSegmentNode
>;

export const RandomBucketSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.RandomBucket),
  id: Type.String(),
  percent: Type.Number({
    description:
      "The percentage of users to be randomly assigned to be in the segment. Expressed as a number between 0 and 1.",
  }),
});

export type RandomBucketSegmentNode = Static<typeof RandomBucketSegmentNode>;

export enum RelationalOperators {
  Equals = "=",
  GreaterThanOrEqual = ">=",
  LessThan = "<",
}

export const PerformedSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.Performed),
  id: Type.String(),
  event: Type.String(),
  times: Type.Optional(Type.Number()),
  timesOperator: Type.Optional(Type.Enum(RelationalOperators)),
  withinSeconds: Type.Optional(Type.Number()),
  properties: Type.Optional(
    Type.Array(
      Type.Object({
        path: Type.String(),
        operator: SegmentOperator,
      }),
    ),
  ),
});

export type PerformedSegmentNode = Static<typeof PerformedSegmentNode>;

// Order of this union is important, as it determines the order of the listed events in the UI
export const EmailEvent = Type.Union([
  Type.Literal(InternalEventType.MessageSent),
  Type.Literal(InternalEventType.EmailDropped),
  Type.Literal(InternalEventType.EmailDelivered),
  Type.Literal(InternalEventType.EmailOpened),
  Type.Literal(InternalEventType.EmailClicked),
  Type.Literal(InternalEventType.EmailBounced),
  Type.Literal(InternalEventType.EmailMarkedSpam),
]);

export type EmailEvent = Static<typeof EmailEvent>;

export const EmailEventList: string[] = EmailEvent.anyOf.map((e) => e.const);

export const EmailSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.Email),
  id: Type.String(),
  event: EmailEvent,
  times: Type.Optional(Type.Number()),
  templateId: Type.String(),
});

export type EmailSegmentNode = Static<typeof EmailSegmentNode>;

export const LastPerformedSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.LastPerformed),
  id: Type.String(),
  event: Type.String(),
  whereProperties: Type.Optional(
    Type.Array(
      Type.Object({
        path: Type.String(),
        operator: SegmentOperator,
      }),
      {
        description:
          "Used to select which events are eligible to be considered.",
      },
    ),
  ),
  hasProperties: Type.Optional(
    Type.Array(
      Type.Object({
        path: Type.String(),
        operator: SegmentOperator,
      }),
      {
        description:
          "Used to evaluate whether the user is in the segment based on the properties of the selected event.",
      },
    ),
  ),
});

export type LastPerformedSegmentNode = Static<typeof LastPerformedSegmentNode>;

export const BroadcastSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.Broadcast),
  id: Type.String(),
});

export type BroadcastSegmentNode = Static<typeof BroadcastSegmentNode>;

export const TraitSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.Trait),
  id: Type.String(),
  path: Type.String(),
  operator: SegmentOperator,
});

export type TraitSegmentNode = Static<typeof TraitSegmentNode>;

export const AndSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.And),
  id: Type.String(),
  children: Type.Array(Type.String()),
});

export type AndSegmentNode = Static<typeof AndSegmentNode>;

export const OrSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.Or),
  id: Type.String(),
  children: Type.Array(Type.String()),
});

export type OrSegmentNode = Static<typeof OrSegmentNode>;

export const ManualSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.Manual),
  version: Type.Number(),
  id: Type.String(),
});

export type ManualSegmentNode = Static<typeof ManualSegmentNode>;

export const EveryoneSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.Everyone),
  id: Type.String(),
});

export type EveryoneSegmentNode = Static<typeof EveryoneSegmentNode>;

export const KeyedPerformedPropertiesOperator = Type.Union([
  SegmentEqualsOperator,
  SegmentNotEqualsOperator,
  ExistsOperator,
  SegmentGreaterThanOrEqualOperator,
  SegmentLessThanOperator,
]);

export type KeyedPerformedPropertiesOperator = Static<
  typeof KeyedPerformedPropertiesOperator
>;

export const KeyedPerformedSegmentNode = Type.Object({
  type: Type.Literal(SegmentNodeType.KeyedPerformed),
  id: Type.String(),
  event: Type.String(),
  key: Type.String(),
  times: Type.Optional(Type.Number()),
  // Note that this will not be backwards looking
  timesOperator: Type.Optional(Type.Enum(RelationalOperators)),
  properties: Type.Optional(
    Type.Array(
      Type.Object({
        path: Type.String(),
        operator: KeyedPerformedPropertiesOperator,
      }),
    ),
  ),
});

export type KeyedPerformedSegmentNode = Static<
  typeof KeyedPerformedSegmentNode
>;

export const BodySegmentNode = Type.Union([
  TraitSegmentNode,
  AndSegmentNode,
  OrSegmentNode,
  PerformedSegmentNode,
  LastPerformedSegmentNode,
  EmailSegmentNode,
  BroadcastSegmentNode,
  SubscriptionGroupSegmentNode,
  RandomBucketSegmentNode,
]);

export type BodySegmentNode = Static<typeof BodySegmentNode>;

export const SegmentNode = Type.Union([
  BodySegmentNode,
  ManualSegmentNode,
  EveryoneSegmentNode,
  KeyedPerformedSegmentNode,
]);

export type SegmentNode = Static<typeof SegmentNode>;

export const SegmentDefinition = Type.Object({
  entryNode: SegmentNode,
  nodes: Type.Array(BodySegmentNode),
});

export type SegmentDefinition = Static<typeof SegmentDefinition>;

export enum UserPropertyDefinitionType {
  Trait = "Trait",
  Id = "Id",
  AnonymousId = "AnonymousId",
  Performed = "Performed",
  Group = "Group",
  AnyOf = "AnyOf",
  PerformedMany = "PerformedMany",
  KeyedPerformed = "KeyedPerformed",
  File = "File",
}

export const TraitUserPropertyDefinition = Type.Object(
  {
    // set to optional for backwards compatibility
    id: Type.Optional(Type.String()),
    type: Type.Literal(UserPropertyDefinitionType.Trait),
    path: Type.String(),
  },
  {
    title: "TraitUserPropertyDefinition",
    description:
      "A user property definition that resolves to a matching trait.",
  },
);

export type TraitUserPropertyDefinition = Static<
  typeof TraitUserPropertyDefinition
>;

export const IdUserPropertyDefinition = Type.Object(
  {
    type: Type.Literal(UserPropertyDefinitionType.Id),
  },
  {
    title: "IdUserPropertyDefinition",
    description: "A user property definition that resolves to a user's id.",
  },
);

export type IdUserPropertyDefinition = Static<typeof IdUserPropertyDefinition>;

export const AnonymousIdUserPropertyDefinition = Type.Object(
  {
    type: Type.Literal(UserPropertyDefinitionType.AnonymousId),
  },
  {
    title: "AnonymousIdUserPropertyDefinition",
    description:
      "A user property definition that resolves to a user's anonymous id.",
  },
);

export type AnonymousIdUserPropertyDefinition = Static<
  typeof AnonymousIdUserPropertyDefinition
>;

const UserPropertyEqualsOperator = Type.Object({
  type: Type.Literal(UserPropertyOperatorType.Equals),
  value: Type.String(),
});

export type UserPropertyEqualsOperator = Static<
  typeof UserPropertyEqualsOperator
>;

export const UserPropertyOperator = Type.Union([UserPropertyEqualsOperator]);

export type UserPropertyOperator = Static<typeof UserPropertyOperator>;

export const PerformedUserPropertyDefinition = Type.Object(
  {
    // set to optional for backwards compatibility
    id: Type.Optional(Type.String()),
    type: Type.Literal(UserPropertyDefinitionType.Performed),
    event: Type.String(),
    path: Type.String(),
    skipReCompute: Type.Optional(Type.Boolean()),
    properties: Type.Optional(
      Type.Array(
        Type.Object({
          path: Type.String(),
          operator: UserPropertyOperator,
        }),
      ),
    ),
  },
  {
    title: "PerformedUserPropertyDefinition",
    description:
      "A user property definition that renders the last matching track event.",
  },
);

export type PerformedUserPropertyDefinition = Static<
  typeof PerformedUserPropertyDefinition
>;

export const PerformedManyUserPropertyDefinition = Type.Object(
  {
    id: Type.Optional(Type.String()),
    type: Type.Literal(UserPropertyDefinitionType.PerformedMany),
    or: Type.Array(Type.Object({ event: Type.String() })),
  },
  {
    title: "PerformedManyUserPropertyDefinition",
    description:
      "A user property definition that renders all matching track events.",
  },
);

export type PerformedManyUserPropertyDefinition = Static<
  typeof PerformedManyUserPropertyDefinition
>;

export const FileUserPropertyDefinition = Type.Object(
  {
    id: Type.Optional(Type.String()),
    type: Type.Literal(UserPropertyDefinitionType.File),
    skipReCompute: Type.Optional(Type.Boolean()),
    name: Type.String(),
  },
  {
    title: "FileUserPropertyDefinition",
    description: "A user property definition that resolves to a file.",
  },
);

export type FileUserPropertyDefinition = Static<
  typeof FileUserPropertyDefinition
>;

export const UserPropertyAssignments = Type.Record(Type.String(), Type.Any());

export type UserPropertyAssignments = Static<typeof UserPropertyAssignments>;

export const ParsedPerformedManyValueItem = Type.Object({
  event: Type.String(),
  timestamp: Type.String(),
  properties: UserPropertyAssignments,
});

export type ParsedPerformedManyValueItem = Static<
  typeof ParsedPerformedManyValueItem
>;

export const PerformedManyValueItem = Type.Object({
  event: Type.String(),
  timestamp: Type.String(),
  properties: Type.String(),
});

export type PerformedManyValueItem = Static<typeof PerformedManyValueItem>;

export const PerformedManyValue = Type.Array(PerformedManyValueItem);

export type PerformedManyValue = Static<typeof PerformedManyValue>;

export const AnyOfUserPropertyDefinition = Type.Object(
  {
    id: Type.String(),
    type: Type.Literal(UserPropertyDefinitionType.AnyOf),
    children: Type.Array(Type.String()),
  },
  {
    title: "AnyOfUserPropertyDefinition",
    description:
      "A user property definition that resolves to the first matching user property definition.",
  },
);

export type AnyOfUserPropertyDefinition = Static<
  typeof AnyOfUserPropertyDefinition
>;

export const GroupParentUserPropertyDefinitions = Type.Union(
  [AnyOfUserPropertyDefinition],
  {
    title: "GroupParentUserPropertyDefinitions",
    description:
      "A user property definition that is a parent of other user property definitions.",
  },
);

export type GroupParentUserPropertyDefinitions = Static<
  typeof GroupParentUserPropertyDefinitions
>;

export const KeyedPerformedUserPropertyDefinition = Type.Object(
  {
    id: Type.Optional(Type.String()),
    type: Type.Literal(UserPropertyDefinitionType.KeyedPerformed),
    event: Type.String(),
    path: Type.String(),
    key: Type.String(),
    properties: Type.Optional(
      Type.Array(
        Type.Object({
          path: Type.String(),
          operator: UserPropertyOperator,
        }),
      ),
    ),
  },
  {
    title: "KeyedPerformedUserPropertyDefinition",
    description:
      "A user property definition that renders the last matching track event with a given key. Used in event entry journeys.",
  },
);

export type KeyedPerformedUserPropertyDefinition = Static<
  typeof KeyedPerformedUserPropertyDefinition
>;

export const LeafUserPropertyDefinition = Type.Union(
  [
    TraitUserPropertyDefinition,
    PerformedUserPropertyDefinition,
    FileUserPropertyDefinition,
    KeyedPerformedUserPropertyDefinition,
  ],
  {
    title: "LeafUserPropertyDefinition",
    description: "Child of a group user property definition.",
  },
);

export type LeafUserPropertyDefinition = Static<
  typeof LeafUserPropertyDefinition
>;

export const GroupChildrenUserPropertyDefinitions = Type.Union(
  [GroupParentUserPropertyDefinitions, LeafUserPropertyDefinition],
  {
    title: "GroupChildrenUserPropertyDefinitions",
    description:
      "A user property definition that is a child of a group user property definition.",
  },
);

export type GroupChildrenUserPropertyDefinitions = Static<
  typeof GroupChildrenUserPropertyDefinitions
>;

export const GroupUserPropertyDefinition = Type.Object(
  {
    type: Type.Literal(UserPropertyDefinitionType.Group),
    entry: Type.String(),
    nodes: Type.Array(GroupChildrenUserPropertyDefinitions),
  },
  {
    title: "GroupUserPropertyDefinition",
    description:
      "A user property definition that is a parent of other user property definitions.",
  },
);

export type GroupUserPropertyDefinition = Static<
  typeof GroupUserPropertyDefinition
>;

export const UserPropertyDefinition = Type.Union(
  [
    IdUserPropertyDefinition,
    AnonymousIdUserPropertyDefinition,
    GroupUserPropertyDefinition,
    LeafUserPropertyDefinition,
    PerformedManyUserPropertyDefinition,
  ],
  {
    title: "UserPropertyDefinition",
    description: "A user property definition.",
  },
);

export type UserPropertyDefinition = Static<typeof UserPropertyDefinition>;

export enum JourneyNodeType {
  DelayNode = "DelayNode",
  SegmentSplitNode = "SegmentSplitNode",
  MessageNode = "MessageNode",
  RateLimitNode = "RateLimitNode",
  ExperimentSplitNode = "ExperimentSplitNode",
  ExitNode = "ExitNode",
  // Inconsistent naming is for backwards compatibility.
  SegmentEntryNode = "EntryNode",
  EventEntryNode = "EventEntryNode",
  WaitForNode = "WaitForNode",
}

const BaseNode = {
  id: Type.String(),
};

export const SegmentEntryNode = Type.Object(
  {
    type: Type.Literal(JourneyNodeType.SegmentEntryNode),
    segment: Type.String(),
    child: Type.String(),
    reEnter: Type.Optional(Type.Boolean()),
  },
  {
    title: "Segment Entry Node",
    description:
      "The first node in a journey - triggered when a user enters a segment.",
  },
);

export type SegmentEntryNode = Static<typeof SegmentEntryNode>;

export const EventEntryNode = Type.Object(
  {
    type: Type.Literal(JourneyNodeType.EventEntryNode),
    event: Type.String(),
    key: Type.Optional(Type.String()),
    child: Type.String(),
  },
  {
    title: "Event Entry Node",
    description:
      "The first node in a journey - triggered when a user performs a specific event.",
  },
);

export type EventEntryNode = Static<typeof EventEntryNode>;

export const EntryNode = Type.Union([SegmentEntryNode, EventEntryNode]);

export type EntryNode = Static<typeof EntryNode>;

export const WaitForSegmentChild = Type.Object({
  id: Type.String(),
  segmentId: Type.String(),
});

export type WaitForSegmentChild = Static<typeof WaitForSegmentChild>;

const WaitForNodeBase = {
  ...BaseNode,
  type: Type.Literal(JourneyNodeType.WaitForNode),
};

export const WaitForNode = Type.Object(
  {
    ...WaitForNodeBase,
    timeoutSeconds: Type.Number(),
    timeoutChild: Type.String(),
    segmentChildren: Type.Array(WaitForSegmentChild),
  },
  {
    title: "Wait For Node",
    description:
      "A node which waits for a user to enter a segment before progressing.",
  },
);

export type WaitForNode = Static<typeof WaitForNode>;

export const SortDirectionEnum = {
  Asc: "Asc",
  Desc: "Desc",
} as const;

export const SortDirection = Type.KeyOf(Type.Const(SortDirectionEnum));

export type SortDirection = Static<typeof SortDirection>;

export enum CursorDirectionEnum {
  After = "after",
  Before = "before",
}

export enum DelayVariantType {
  Second = "Second",
  LocalTime = "LocalTime",
  UserProperty = "UserProperty",
}

export const UserPropertyDelayVariant = Type.Object({
  type: Type.Literal(DelayVariantType.UserProperty),
  userProperty: Type.String(),
  offsetSeconds: Type.Optional(Type.Number()),
  offsetDirection: Type.Optional(Type.Enum(CursorDirectionEnum)),
});

export type UserPropertyDelayVariant = Static<typeof UserPropertyDelayVariant>;

export const SecondsDelayVariant = Type.Object({
  type: Type.Literal(DelayVariantType.Second),
  seconds: Type.Number(),
});

export type SecondsDelayVariant = Static<typeof SecondsDelayVariant>;

export const AllowedDayIndices = Type.Union([
  Type.Literal(0),
  Type.Literal(1),
  Type.Literal(2),
  Type.Literal(3),
  Type.Literal(4),
  Type.Literal(5),
  Type.Literal(6),
]);

export type AllowedDayIndices = Static<typeof AllowedDayIndices>;

export const LocalTimeDelayVariant = Type.Object({
  type: Type.Literal(DelayVariantType.LocalTime),
  minute: Type.Optional(Type.Number()),
  hour: Type.Number(),
  allowedDaysOfWeek: Type.Optional(Type.Array(AllowedDayIndices)),
  // TODO support additional time units
});

export type LocalTimeDelayVariant = Static<typeof LocalTimeDelayVariant>;

export type LocalTimeDelayVariantFields = Omit<LocalTimeDelayVariant, "type">;

export const DelayVariant = Type.Union([
  SecondsDelayVariant,
  LocalTimeDelayVariant,
  UserPropertyDelayVariant,
]);

export type DelayVariant = Static<typeof DelayVariant>;

export const DelayNode = Type.Object(
  {
    ...BaseNode,
    type: Type.Literal(JourneyNodeType.DelayNode),
    variant: DelayVariant,
    child: Type.String(),
  },
  {
    title: "Delay Node",
    description:
      "Delays a users progression through the journey for either a set amount of time, or until a specific date time.",
  },
);

export type DelayNode = Static<typeof DelayNode>;

export const RateLimitNode = Type.Object(
  {
    ...BaseNode,
    type: Type.Literal(JourneyNodeType.RateLimitNode),
  },
  {
    title: "Rate Limit Node",
    description:
      "Used to limit the frequency with which users are contacted by a given Journey.",
  },
);

export type RateLimitNode = Static<typeof RateLimitNode>;

export const EmailMessageVariant = Type.Object({
  type: Type.Literal(ChannelType.Email),
  templateId: Type.String(),
  providerOverride: Type.Optional(WorkspaceWideEmailProviders),
});

export type EmailMessageVariant = Static<typeof EmailMessageVariant>;

export const MobilePushMessageVariant = Type.Object({
  type: Type.Literal(ChannelType.MobilePush),
  templateId: Type.String(),
  providerOverride: Type.Optional(Type.Enum(MobilePushProviderType)),
});

export type MobilePushMessageVariant = Static<typeof MobilePushMessageVariant>;

export enum TwilioSenderOverrideType {
  MessageSid = "MessageSid",
  PhoneNumber = "PhoneNumber",
}

export const TwilioSenderOverride = Type.Union([
  Type.Object({
    type: Type.Literal(TwilioSenderOverrideType.MessageSid),
    messagingServiceSid: Type.String(),
  }),
  Type.Object({
    type: Type.Literal(TwilioSenderOverrideType.PhoneNumber),
    phone: Type.String(),
  }),
]);

export type TwilioSenderOverride = Static<typeof TwilioSenderOverride>;

const BaseSmsMessageVariant = Type.Object({
  type: Type.Literal(ChannelType.Sms),
  templateId: Type.String(),
});

export const NoSmsProviderOverride = Type.Object({
  // Provider override has to be nullable to be compatible with JSON schema
  providerOverride: Type.Optional(Type.Null()),
  senderOverride: Type.Optional(Type.Null()),
});

export type NoSmsProviderOverride = Static<typeof NoSmsProviderOverride>;

export const TwilioOverride = Type.Object({
  providerOverride: Type.Literal(SmsProviderType.Twilio),
  senderOverride: Type.Optional(TwilioSenderOverride),
});

export type TwilioOverride = Static<typeof TwilioOverride>;

export const TestSmsOverride = Type.Object({
  providerOverride: Type.Literal(SmsProviderType.Test),
  senderOverride: Type.Optional(Type.Null()),
});

export type TestSmsOverride = Static<typeof TestSmsOverride>;

export const SmsProviderOverride = Type.Union([
  NoSmsProviderOverride,
  TwilioOverride,
  TestSmsOverride,
]);

export type SmsProviderOverride = Static<typeof SmsProviderOverride>;

export const SmsMessageVariant = Type.Union([
  Type.Composite([BaseSmsMessageVariant, NoSmsProviderOverride]),
  Type.Composite([BaseSmsMessageVariant, TwilioOverride]),
  Type.Composite([BaseSmsMessageVariant, TestSmsOverride]),
]);

export type SmsMessageVariant = Static<typeof SmsMessageVariant>;

export const WebhookMessageVariant = Type.Object({
  type: Type.Literal(ChannelType.Webhook),
  templateId: Type.String(),
});

export type WebhookMessageVariant = Static<typeof WebhookMessageVariant>;

export const MessageVariant = Type.Union([
  EmailMessageVariant,
  MobilePushMessageVariant,
  SmsMessageVariant,
  WebhookMessageVariant,
]);

export type MessageVariant = Static<typeof MessageVariant>;

export const MessageNode = Type.Object(
  {
    ...BaseNode,
    type: Type.Literal(JourneyNodeType.MessageNode),
    name: Type.Optional(Type.String()),
    subscriptionGroupId: Type.Optional(Type.String()),
    variant: MessageVariant,
    child: Type.String(),
    syncProperties: Type.Optional(Type.Boolean()),
    skipOnFailure: Type.Optional(Type.Boolean()),
  },
  {
    title: "Message Node",
    description: "Used to contact a user on a message channel.",
  },
);

export type MessageNode = Static<typeof MessageNode>;

export enum SegmentSplitVariantType {
  Boolean = "Boolean",
}

// TODO change this to segments, plural
export const BooleanSegmentSplitVariant = Type.Object({
  type: Type.Literal(SegmentSplitVariantType.Boolean),
  segment: Type.String(),
  trueChild: Type.String(),
  falseChild: Type.String(),
});

// Later implement a split on 1 > segments
export const SegmentSplitVariant = Type.Union([BooleanSegmentSplitVariant]);

export const SegmentSplitNode = Type.Object(
  {
    ...BaseNode,
    type: Type.Literal(JourneyNodeType.SegmentSplitNode),
    variant: SegmentSplitVariant,
    name: Type.Optional(Type.String()),
  },
  {
    title: "Segment Split Node",
    description:
      "Used to split users among audiences, based on the behavior and attributes.",
  },
);

export type SegmentSplitNode = Static<typeof SegmentSplitNode>;

export const ExperimentSplitNode = Type.Object(
  {
    ...BaseNode,
    type: Type.Literal(JourneyNodeType.ExperimentSplitNode),
  },
  {
    title: "Experiment Split Node",
    description:
      "Used to split users among experiment paths, to test their effectiveness.",
  },
);

export type ExperimentSplitNode = Static<typeof ExperimentSplitNode>;

export const ExitNode = Type.Object(
  {
    type: Type.Literal(JourneyNodeType.ExitNode),
  },
  {
    title: "Exit Node",
    description:
      "Defines when a user exits a journey. Allows users to re-enter the journey, under some set of conditions.",
  },
);

export type ExitNode = Static<typeof ExitNode>;

export const JourneyBodyNode = Type.Union([
  DelayNode,
  RateLimitNode,
  SegmentSplitNode,
  MessageNode,
  ExperimentSplitNode,
  WaitForNode,
]);

export type JourneyBodyNode = Static<typeof JourneyBodyNode>;

export const JourneyNode = Type.Union([EntryNode, ExitNode, JourneyBodyNode]);

export type JourneyNode = Static<typeof JourneyNode>;

export const JourneyDefinition = Type.Object({
  entryNode: EntryNode,
  exitNode: ExitNode,
  nodes: Type.Array(JourneyBodyNode),
});

export type JourneyDefinition = Static<typeof JourneyDefinition>;

export const SegmentStatusEnum = {
  NotStarted: "NotStarted",
  Running: "Running",
  Paused: "Paused",
} as const;

export const SegmentStatus = Type.KeyOf(Type.Const(SegmentStatusEnum));

export type SegmentStatus = Static<typeof SegmentStatus>;

export const SegmentResource = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  name: Type.String(),
  definition: SegmentDefinition,
  subscriptionGroupId: Type.Optional(Type.String()),
  updatedAt: Type.Number(),
  lastRecomputed: Type.Optional(Type.Number()),
  resourceType: Type.Optional(ResourceType),
  status: Type.Optional(SegmentStatus),
});

export type SegmentResource = Static<typeof SegmentResource>;

export const SegmentTimestamps = Type.Object({
  createdAt: Type.Number(),
  updatedAt: Type.Number(),
  definitionUpdatedAt: Type.Number(),
});

export type SegmentTimestamps = Static<typeof SegmentTimestamps>;

export const SavedSegmentResource = Type.Composite([
  SegmentResource,
  SegmentTimestamps,
]);

export type SavedSegmentResource = Static<typeof SavedSegmentResource>;

export const PartialSegmentResource = Type.Composite([
  Type.Omit(SegmentResource, ["definition"]),
  SegmentTimestamps,
  Type.Object({
    definition: Type.Optional(SegmentDefinition),
  }),
]);

export type PartialSegmentResource = Static<typeof PartialSegmentResource>;

export const UpsertSubscriptionGroupResourceOther = Type.Pick(
  SubscriptionGroupResource,
  ["workspaceId", "channel", "type"],
);

export const SubscriptionGroupUpsertValidationErrorType = {
  IdError: "IdError",
  UniqueConstraintViolation: "UniqueConstraintViolation",
  BadValues: "BadValues",
} as const;

export const SubscriptionGroupUpsertValidationIdError = Type.Object({
  type: Type.Literal(SubscriptionGroupUpsertValidationErrorType.IdError),
  message: Type.String(),
});

export type SubscriptionGroupUpsertValidationIdError = Static<
  typeof SubscriptionGroupUpsertValidationIdError
>;

export const SubscriptionGroupUpsertValidationUniqueConstraintViolation =
  Type.Object({
    type: Type.Literal(
      SubscriptionGroupUpsertValidationErrorType.UniqueConstraintViolation,
    ),
    message: Type.String(),
  });

export type SubscriptionGroupUpsertValidationUniqueConstraintViolation = Static<
  typeof SubscriptionGroupUpsertValidationUniqueConstraintViolation
>;

export const SubscriptionGroupUpsertValidationBadValues = Type.Object({
  type: Type.Literal(SubscriptionGroupUpsertValidationErrorType.BadValues),
  message: Type.String(),
});

export type SubscriptionGroupUpsertValidationBadValues = Static<
  typeof SubscriptionGroupUpsertValidationBadValues
>;

export const SubscriptionGroupUpsertValidationError = Type.Union([
  SubscriptionGroupUpsertValidationIdError,
  SubscriptionGroupUpsertValidationUniqueConstraintViolation,
  SubscriptionGroupUpsertValidationBadValues,
]);

export type SubscriptionGroupUpsertValidationError = Static<
  typeof SubscriptionGroupUpsertValidationError
>;

export type UpsertSubscriptionGroupResourceOther = Static<
  typeof UpsertSubscriptionGroupResourceOther
>;

export const UpsertSubscriptionGroupResource = Type.Composite([
  IdOrName,
  UpsertSubscriptionGroupResourceOther,
]);

export type UpsertSubscriptionGroupResource = Static<
  typeof UpsertSubscriptionGroupResource
>;

export const BroadcastResourceVersionEnum = {
  V1: "V1",
  V2: "V2",
} as const;

export const BroadcastResourceVersion = Type.KeyOf(
  Type.Const(BroadcastResourceVersionEnum),
);

export type BroadcastResourceVersion = Static<typeof BroadcastResourceVersion>;

export const BroadcastResource = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  name: Type.String(),
  segmentId: Type.Optional(Type.String()),
  journeyId: Type.Optional(Type.String()),
  messageTemplateId: Type.Optional(Type.String()),
  status: Type.Union([
    Type.Literal("NotStarted"),
    Type.Literal("InProgress"),
    Type.Literal("Triggered"),
  ]),
  archived: Type.Optional(Type.Boolean()),
  createdAt: Type.Number(),
  updatedAt: Type.Number(),
  triggeredAt: Type.Optional(Type.Number()),
  version: Type.Optional(Type.Literal(BroadcastResourceVersionEnum.V1)),
});

export type BroadcastResource = Static<typeof BroadcastResource>;

export const UpdateBroadcastRequest = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
  name: Type.Optional(Type.String()),
});

export type UpdateBroadcastRequest = Static<typeof UpdateBroadcastRequest>;

export const TriggerBroadcastRequest = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
});

export type TriggerBroadcastRequest = Static<typeof TriggerBroadcastRequest>;

export const UpsertSegmentResource = Type.Intersect([
  Type.Omit(Type.Partial(SegmentResource), ["workspaceId", "name"]),
  Type.Pick(SegmentResource, ["workspaceId", "name"]),
  Type.Object({
    createOnly: Type.Optional(Type.Boolean()),
  }),
]);

export type UpsertSegmentResource = Static<typeof UpsertSegmentResource>;

export enum UpsertSegmentValidationErrorType {
  IdError = "IdError",
  UniqueConstraintViolation = "UniqueConstraintViolation",
}

export const IdUpsertSegmentValidationError = Type.Object({
  type: Type.Literal(UpsertSegmentValidationErrorType.IdError),
  message: Type.String(),
});

export type IdUpsertSegmentValidationError = Static<
  typeof IdUpsertSegmentValidationError
>;

export const UniqueConstraintViolationUpsertSegmentValidationError =
  Type.Object({
    type: Type.Literal(
      UpsertSegmentValidationErrorType.UniqueConstraintViolation,
    ),
    message: Type.String(),
  });

export type UniqueConstraintViolationUpsertSegmentValidationError = Static<
  typeof UniqueConstraintViolationUpsertSegmentValidationError
>;

export const UpsertSegmentValidationError = Type.Union([
  IdUpsertSegmentValidationError,
  UniqueConstraintViolationUpsertSegmentValidationError,
]);

export type UpsertSegmentValidationError = Static<
  typeof UpsertSegmentValidationError
>;

export const DeleteSegmentRequest = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
});

export type DeleteSegmentRequest = Static<typeof DeleteSegmentRequest>;

export const UserId = Type.String({
  description:
    "Unique identifier for the user. Should be the id of the user in your system. Only applicable to logged in users.",
  examples: ["1043", "user-123", "0a58e5e4-c753-477e-a6c4-f9b0e3396b9b"],
});

export type UserId = Static<typeof UserId>;

export const AnonymousId = Type.String({
  description:
    "Identifier for a logged out user. It can be any pseudo-unique identifier, for example a session Id or a UUID.",
  examples: ["0a58e5e4-c753-477e-a6c4-f9b0e3396b9b", "session-123"],
});

export type AnonymousId = Static<typeof AnonymousId>;

export const PUBLIC_WRITE_KEY_DESCRIPTION =
  "Authorization header for the request, in the format `Bearer <token>`. Find your token at https://app.dittofeed.com/dashboard/settings#write-key.";

export const PublicWriteKey = Type.String({
  description: PUBLIC_WRITE_KEY_DESCRIPTION,
  examples: [
    "Basic YzQ2MDllYjMtYTE2OC00MGI5LWI1ZWMtYTdiYTFkYzY2NWYwOjI5NGYwYjkyOTI1YWZhNzM=",
  ],
});

export type PublicWriteKey = Static<typeof PublicWriteKey>;

export const GetEventsRequest = Type.Object({
  workspaceId: Type.String(),
  searchTerm: Type.Optional(Type.String()),
  userId: Type.Optional(UserId),
  offset: Type.Optional(Type.Number()),
  limit: Type.Optional(Type.Number()),
  messageId: Type.Optional(Type.String()),
  // unix timestamp units ms
  startDate: Type.Optional(Type.Number()),
  endDate: Type.Optional(Type.Number()),
  event: Type.Optional(Type.Array(Type.String())),
  broadcastId: Type.Optional(Type.String()),
  journeyId: Type.Optional(Type.String()),
  eventType: Type.Optional(Type.String()),
});

export type GetEventsRequest = Static<typeof GetEventsRequest>;

export const Traits = Type.Record(Type.String(), Type.Any(), {
  description:
    "Free-form dictionary of traits of the user, like email or name. Can contain arbitrary JSON values.",
  examples: [
    {
      name: "Michael Scott",
      items: [
        {
          id: 1,
          name: "Paper",
        },
        {
          id: 2,
          name: "Stapler",
        },
      ],
    },
  ],
});

export type Traits = Static<typeof Traits>;

export const GetEventsResponseItem = Type.Object({
  messageId: Type.String(),
  eventType: Type.String(),
  event: Type.String(),
  userId: Nullable(UserId),
  anonymousId: Nullable(AnonymousId),
  processingTime: Type.String(),
  eventTime: Type.String(),
  traits: Type.String(),
});

export type GetEventsResponseItem = Static<typeof GetEventsResponseItem>;

export const GetEventsResponse = Type.Object({
  events: Type.Array(GetEventsResponseItem),
  count: Type.Number(),
});

export type GetEventsResponse = Static<typeof GetEventsResponse>;

export const DownloadEventsRequest = Type.Omit(GetEventsRequest, [
  "offset",
  "limit",
]);
export type DownloadEventsRequest = Static<typeof DownloadEventsRequest>;

export const LowCodeEmailJsonBody = Type.Recursive(
  (self) =>
    Type.Composite([
      Type.Object({
        type: Type.Optional(Type.String()),
        attrs: Type.Optional(Type.Record(Type.String(), Type.Any())),
        content: Type.Optional(Type.Array(self)),
        marks: Type.Optional(
          Type.Array(
            Type.Composite([
              Type.Object({
                type: Type.String(),
                attrs: Type.Optional(Type.Record(Type.String(), Type.Any())),
              }),
              Type.Record(Type.String(), Type.Any()),
            ]),
          ),
        ),
        text: Type.Optional(Type.String()),
      }),
      Type.Record(Type.String(), Type.Any()),
    ]),
  {
    $id: "LowCodeEmailJsonBody",
    title: "LowCodeEmailJsonBody",
  },
);

export type LowCodeEmailJsonBody = Static<typeof LowCodeEmailJsonBody>;

export const EmailContentsType = {
  Code: "Code",
  LowCode: "LowCode",
} as const;

export const EmailContentsTypeEnum = Type.KeyOf(Type.Const(EmailContentsType));

export type EmailContentsType = Static<typeof EmailContentsTypeEnum>;

export const BaseEmailContents = Type.Object({
  from: Type.String(),
  subject: Type.String(),
  replyTo: Type.Optional(Type.String()),
  cc: Type.Optional(Type.String()),
  bcc: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  headers: Type.Optional(
    Type.Array(
      Type.Object({
        name: Type.String(),
        value: Type.String(),
      }),
    ),
  ),
  attachmentUserProperties: Type.Optional(
    Type.Array(Type.String(), {
      description:
        "Names of user properties to attach to the email as attachments.",
    }),
  ),
});

export type BaseEmailContents = Static<typeof BaseEmailContents>;

export const CodeEmailContents = Type.Composite([
  BaseEmailContents,
  Type.Object({
    body: Type.String(),
  }),
]);

export type CodeEmailContents = Static<typeof CodeEmailContents>;

export const LowCodeEmailContents = Type.Composite([
  Type.Object({
    emailContentsType: Type.Literal(EmailContentsType.LowCode),
    body: Type.Ref(LowCodeEmailJsonBody),
  }),
  BaseEmailContents,
]);

export type LowCodeEmailContents = Static<typeof LowCodeEmailContents>;

export const EmailContents = Type.Union([
  CodeEmailContents,
  LowCodeEmailContents,
]);

const BaseEmailTemplateResource = Type.Object({
  type: Type.Literal(ChannelType.Email),
});

export const CodeEmailTemplateResource = Type.Composite([
  BaseEmailTemplateResource,
  CodeEmailContents,
]);

export type CodeEmailTemplateResource = Static<
  typeof CodeEmailTemplateResource
>;

export const LowCodeEmailTemplateResource = Type.Composite([
  BaseEmailTemplateResource,
  LowCodeEmailContents,
]);

export type LowCodeEmailTemplateResource = Static<
  typeof LowCodeEmailTemplateResource
>;

export const EmailTemplateResource = Type.Union(
  [CodeEmailTemplateResource, LowCodeEmailTemplateResource],
  {
    description: "Email template resource",
  },
);

export type EmailTemplateResource = Static<typeof EmailTemplateResource>;

export const EmailConfiguration = Type.Composite([
  Type.Omit(CodeEmailContents, ["headers"]),
  Type.Object({
    to: Type.String(),
    headers: Type.Optional(Type.Record(Type.String(), Type.String())),
  }),
]);

export type EmailConfiguration = Static<typeof EmailConfiguration>;

export const MobilePushTemplateResource = Type.Object(
  {
    type: Type.Literal(ChannelType.MobilePush),
    title: Type.Optional(Type.String()),
    body: Type.Optional(Type.String()),
    imageUrl: Type.Optional(Type.String()),
    android: Type.Optional(
      Type.Object({
        notification: Type.Object({
          channelId: Type.Optional(Type.String()),
        }),
      }),
    ),
  },
  {
    description: "Mobile push template resource",
  },
);

export type MobilePushTemplateResource = Static<
  typeof MobilePushTemplateResource
>;

const SmsContents = Type.Object({
  body: Type.String(),
});

export const SmsTemplateResource = Type.Composite(
  [
    Type.Object({
      type: Type.Literal(ChannelType.Sms),
    }),
    SmsContents,
  ],
  {
    description: "SMS template resource",
  },
);

export type SmsTemplateResource = Static<typeof SmsTemplateResource>;

// Partial of AxiosRequestConfig.
export const WebhookConfig = Type.Object({
  url: Type.Optional(Type.String()),
  method: Type.Optional(Type.String()),
  headers: Type.Optional(Type.Record(Type.String(), Type.String())),
  params: Type.Optional(Type.Any()),
  data: Type.Optional(Type.Any()),
  responseType: Type.Optional(
    Type.Union([Type.Literal("json"), Type.Literal("text")]),
  ),
});

export type WebhookConfig = Static<typeof WebhookConfig>;

export const WebhookContents = Type.Object({
  identifierKey: Type.String(),
  body: Type.String(),
});

export type WebhookContents = Static<typeof WebhookContents>;

export const WebhookTemplateResource = Type.Composite(
  [
    Type.Object({
      type: Type.Literal(ChannelType.Webhook),
    }),
    WebhookContents,
  ],
  {
    description: "Webhook template resource",
  },
);

export type WebhookTemplateResource = Static<typeof WebhookTemplateResource>;

export const MessageTemplateResourceDefinition = Type.Union([
  MobilePushTemplateResource,
  EmailTemplateResource,
  SmsTemplateResource,
  WebhookTemplateResource,
]);

export type MessageTemplateResourceDefinition = Static<
  typeof MessageTemplateResourceDefinition
>;

// Alias for now
export const WebhookTemplateResourceDraft = WebhookTemplateResource;

export type WebhookTemplateResourceDraft = Static<
  typeof WebhookTemplateResourceDraft
>;

export const ParsedWebhookBody = Type.Object({
  config: WebhookConfig,
  secret: Type.Optional(WebhookConfig),
});

export type ParsedWebhookBody = Static<typeof ParsedWebhookBody>;

export const MessageTemplateResourceDraft = Type.Union([
  MobilePushTemplateResource,
  EmailTemplateResource,
  SmsTemplateResource,
  WebhookTemplateResource,
]);

export type MessageTemplateResourceDraft = Static<
  typeof MessageTemplateResourceDraft
>;

const MessageTemplateResourceProperties = {
  workspaceId: Type.String(),
  id: Type.String(),
  name: Type.String(),
  type: Type.Enum(ChannelType),
  definition: Type.Optional(MessageTemplateResourceDefinition),
  draft: Type.Optional(MessageTemplateResourceDraft),
  updatedAt: Type.Number(),
} as const;

export const MessageTemplateResource = Type.Object(
  MessageTemplateResourceProperties,
  {
    $id: "MessageTemplateResource",
  },
);

export type MessageTemplateResource = Static<typeof MessageTemplateResource>;

export type NarrowedMessageTemplateResource<
  T extends MessageTemplateResourceDefinition,
> = Omit<MessageTemplateResource, "definition"> & {
  definition: T;
};

export const UpsertMessageTemplateResource = Type.Object({
  workspaceId: Type.String(),
  id: Type.Optional(Type.String()),
  name: Type.String(),
  definition: Type.Optional(MessageTemplateResourceDefinition),
  draft: Type.Optional(Nullable(MessageTemplateResourceDraft)),
  resourceType: Type.Optional(ResourceType),
});

export type UpsertMessageTemplateResource = Static<
  typeof UpsertMessageTemplateResource
>;

export enum UpsertMessageTemplateValidationErrorType {
  IdError = "IdError",
  UniqueConstraintViolation = "UniqueConstraintViolation",
}

export const UniqueConstraintViolationError = Type.Object({
  type: Type.Literal(
    UpsertMessageTemplateValidationErrorType.UniqueConstraintViolation,
  ),
  message: Type.String(),
});

export type UniqueConstraintViolationError = Static<
  typeof UniqueConstraintViolationError
>;

export const IdErrorMessageTemplateViolation = Type.Object({
  type: Type.Literal(UpsertMessageTemplateValidationErrorType.IdError),
  message: Type.String(),
});

export const UpsertMessageTemplateValidationError = Type.Union([
  UniqueConstraintViolationError,
  IdErrorMessageTemplateViolation,
]);

export type UpsertMessageTemplateValidationError = Static<
  typeof UpsertMessageTemplateValidationError
>;

export const GetMessageTemplatesRequest = Type.Object(
  {
    workspaceId: Type.String(),
    ids: Type.Optional(Type.Array(Type.String())),
    resourceType: Type.Optional(ResourceType),
  },
  {
    $id: "GetMessageTemplatesRequest",
  },
);

export type GetMessageTemplatesRequest = Static<
  typeof GetMessageTemplatesRequest
>;

export const GetMessageTemplatesResponse = Type.Object({
  templates: Type.Array(MessageTemplateResource),
});

export type GetMessageTemplatesResponse = Static<
  typeof GetMessageTemplatesResponse
>;

export const GetSegmentsRequest = Type.Object({
  workspaceId: Type.String(),
  ids: Type.Optional(Type.Array(Type.String())),
  resourceType: Type.Optional(ResourceType),
});

export type GetSegmentsRequest = Static<typeof GetSegmentsRequest>;

export const GetSegmentsResponse = Type.Object({
  segments: Type.Array(SavedSegmentResource),
});

export type GetSegmentsResponse = Static<typeof GetSegmentsResponse>;

export const ResetMessageTemplateResource = Type.Object({
  workspaceId: Type.String(),
  name: Type.String(),
  journeyMetadata: Type.Optional(
    Type.Object({
      journeyId: Type.String(),
      nodeId: Type.String(),
    }),
  ),
  type: Type.Enum(ChannelType),
  emailContentsType: Type.Optional(Type.Enum(EmailContentsType)),
});

export type ResetMessageTemplateResource = Static<
  typeof ResetMessageTemplateResource
>;

export const DeleteMessageTemplateRequest = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
  type: Type.Enum(ChannelType),
});

export type DeleteMessageTemplateRequest = Static<
  typeof DeleteMessageTemplateRequest
>;

export enum CompletionStatus {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Successful = "Successful",
  Failed = "Failed",
}

export interface NotStartedRequest {
  type: CompletionStatus.NotStarted;
}

export interface InProgressRequest {
  type: CompletionStatus.InProgress;
}

export interface SuccessfulRequest<V> {
  type: CompletionStatus.Successful;
  value: V;
}

export interface FailedRequest<E> {
  type: CompletionStatus.Failed;
  error: E;
}

export type EphemeralRequestStatus<E> =
  | NotStartedRequest
  | InProgressRequest
  | FailedRequest<E>;

export type RequestStatus<V, E> =
  | NotStartedRequest
  | InProgressRequest
  | SuccessfulRequest<V>
  | FailedRequest<E>;

export const PersistedEmailProvider = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  type: WorkspaceWideEmailProviders,
});

export type PersistedEmailProvider = Static<typeof PersistedEmailProvider>;

// Backwards compatibility with old email provider types.
export const EmailProviderResource = PersistedEmailProvider;

export type EmailProviderResource = Static<typeof EmailProviderResource>;

export const UpsertEmailProviderResource = Type.Union([
  Type.Intersect([
    Type.Omit(Type.Partial(PersistedEmailProvider), ["id", "workspaceId"]),
    Type.Pick(PersistedEmailProvider, ["id", "workspaceId"]),
  ]),
  Type.Intersect([
    Type.Omit(Type.Partial(PersistedEmailProvider), ["type", "workspaceId"]),
    Type.Pick(PersistedEmailProvider, ["type", "workspaceId"]),
  ]),
]);

export type UpsertEmailProviderResource = Static<
  typeof UpsertEmailProviderResource
>;

export enum DataSourceVariantType {
  SegmentIO = "SegmentIO",
}

export const SegmentIODataSource = Type.Object({
  type: Type.Literal(DataSourceVariantType.SegmentIO),
  sharedSecret: Type.String(),
});

export const DataSourceConfigurationVariant = Type.Union([SegmentIODataSource]);

export const DataSourceConfigurationResource = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  variant: DataSourceConfigurationVariant,
});

export type DataSourceConfigurationResource = Static<
  typeof DataSourceConfigurationResource
>;

export const UpsertDataSourceConfigurationResource = Type.Omit(
  DataSourceConfigurationResource,
  ["id"],
);

export type UpsertDataSourceConfigurationResource = Static<
  typeof UpsertDataSourceConfigurationResource
>;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export const WorkspaceStatusDbEnum = {
  Active: "Active",
  Tombstoned: "Tombstoned",
  Paused: "Paused",
} as const;

export const WorkspaceStatusDb = Type.KeyOf(Type.Const(WorkspaceStatusDbEnum));

export type WorkspaceStatusDb = Static<typeof WorkspaceStatusDb>;

export const WorkspaceResource = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export type WorkspaceResource = Static<typeof WorkspaceResource>;

export const DefaultEmailProviderResource = Type.Object({
  workspaceId: Type.String(),
  emailProviderId: Type.String(),
  fromAddress: Nullable(Type.String()),
});

export type DefaultEmailProviderResource = Static<
  typeof DefaultEmailProviderResource
>;

export const UpsertDefaultEmailProviderRequest = Type.Union([
  DefaultEmailProviderResource,
  Type.Object({
    workspaceId: Type.String(),
    emailProvider: Type.String(),
    fromAddress: Nullable(Type.String()),
  }),
]);

export type UpsertDefaultEmailProviderRequest = Static<
  typeof UpsertDefaultEmailProviderRequest
>;

export const JourneyResourceStatusEnum = {
  NotStarted: "NotStarted",
  Running: "Running",
  Paused: "Paused",
  Broadcast: "Broadcast",
} as const;

export enum AdditionalJourneyNodeType {
  EntryUiNode = "EntryUiNode",
}

export const PartialExceptType = <T1 extends TSchema>(schema: T1) =>
  Type.Composite([
    Type.Partial(Type.Omit(schema, ["type"])),
    Type.Pick(schema, ["type"]),
  ]);

export const EntryUiNodeVariant = Type.Union([
  PartialExceptType(SegmentEntryNode),
  PartialExceptType(EventEntryNode),
]);

export type EntryUiNodeVariant = Static<typeof EntryUiNodeVariant>;

export const EntryUiNodeProps = Type.Object({
  type: Type.Literal(AdditionalJourneyNodeType.EntryUiNode),
  variant: EntryUiNodeVariant,
});

export type EntryUiNodeProps = Static<typeof EntryUiNodeProps>;

export const ExitUiNodeProps = Type.Object({
  type: Type.Literal(JourneyNodeType.ExitNode),
});

export type ExitUiNodeProps = Static<typeof ExitUiNodeProps>;

export const EmailMessageUiNodeProps = Type.Object({
  channel: Type.Literal(ChannelType.Email),
  providerOverride: Type.Optional(WorkspaceWideEmailProviders),
});

export type EmailMessageUiNodeProps = Static<typeof EmailMessageUiNodeProps>;

export const SmsMessageUiNodeProps = Type.Composite([
  Type.Object({
    channel: Type.Literal(ChannelType.Sms),
  }),
  SmsProviderOverride,
]);

export type SmsMessageUiNodeProps = Static<typeof SmsMessageUiNodeProps>;

export const MobilePushMessageUiNodeProps = Type.Object({
  channel: Type.Literal(ChannelType.MobilePush),
  providerOverride: Type.Optional(Type.Enum(MobilePushProviderType)),
});

export type MobilePushMessageUiNodeProps = Static<
  typeof MobilePushMessageUiNodeProps
>;

export const WebhookMessageUiNodeProps = Type.Object({
  channel: Type.Literal(ChannelType.Webhook),
});

export type WebhookMessageUiNodeProps = Static<
  typeof WebhookMessageUiNodeProps
>;

export const MessageChannelUiNodeProps = Type.Union([
  EmailMessageUiNodeProps,
  SmsMessageUiNodeProps,
  MobilePushMessageUiNodeProps,
  WebhookMessageUiNodeProps,
]);

export type MessageChannelUiNodeProps = Static<
  typeof MessageChannelUiNodeProps
>;

export const BaseMessageUiNodeProps = Type.Object({
  type: Type.Literal(JourneyNodeType.MessageNode),
  name: Type.String(),
  templateId: Type.Optional(Type.String()),
  subscriptionGroupId: Type.Optional(Type.String()),
  syncProperties: Type.Optional(Type.Boolean()),
  skipOnFailure: Type.Optional(Type.Boolean()),
});

export type BaseMessageUiNodeProps = Static<typeof BaseMessageUiNodeProps>;

export const MessageUiNodeProps = Type.Union([
  Type.Composite([BaseMessageUiNodeProps, EmailMessageUiNodeProps]),
  Type.Composite([BaseMessageUiNodeProps, SmsMessageUiNodeProps]),
  Type.Composite([BaseMessageUiNodeProps, MobilePushMessageUiNodeProps]),
  Type.Composite([BaseMessageUiNodeProps, WebhookMessageUiNodeProps]),
]);

export type MessageUiNodeProps = Static<typeof MessageUiNodeProps>;

export const DelayUiNodeVariant = Type.Union([
  PartialExceptType(LocalTimeDelayVariant),
  PartialExceptType(SecondsDelayVariant),
  PartialExceptType(UserPropertyDelayVariant),
]);

export type DelayUiNodeVariant = Static<typeof DelayUiNodeVariant>;

export const DelayUiNodeProps = Type.Object({
  type: Type.Literal(JourneyNodeType.DelayNode),
  variant: DelayUiNodeVariant,
});

export type DelayUiNodeProps = Static<typeof DelayUiNodeProps>;

export const SegmentSplitUiNodeProps = Type.Object({
  type: Type.Literal(JourneyNodeType.SegmentSplitNode),
  name: Type.String(),
  segmentId: Type.Optional(Type.String()),
  trueLabelNodeId: Type.String(),
  falseLabelNodeId: Type.String(),
});

export type SegmentSplitUiNodeProps = Static<typeof SegmentSplitUiNodeProps>;

export const WaitForUiNodeProps = Type.Object({
  type: Type.Literal(JourneyNodeType.WaitForNode),
  timeoutSeconds: Type.Optional(Type.Number()),
  timeoutLabelNodeId: Type.String(),
  segmentChildren: Type.Array(
    Type.Object({
      labelNodeId: Type.String(),
      segmentId: Type.Optional(Type.String()),
    }),
  ),
});

export type WaitForUiNodeProps = Static<typeof WaitForUiNodeProps>;

export const JourneyUiBodyNodeTypeProps = Type.Union([
  MessageUiNodeProps,
  DelayUiNodeProps,
  SegmentSplitUiNodeProps,
  WaitForUiNodeProps,
]);

export type JourneyUiBodyNodeTypeProps = Static<
  typeof JourneyUiBodyNodeTypeProps
>;

export const JourneyUiNodeTypeProps = Type.Union([
  EntryUiNodeProps,
  ExitUiNodeProps,
  JourneyUiBodyNodeTypeProps,
]);

export type JourneyUiNodeTypeProps = Static<typeof JourneyUiNodeTypeProps>;

export type JourneyUiNodePairing =
  | [EntryUiNodeProps, EntryNode]
  | [ExitUiNodeProps, ExitNode]
  | [MessageUiNodeProps, SegmentNode]
  | [DelayUiNodeProps, SegmentNode]
  | [SegmentSplitUiNodeProps, SegmentNode]
  | [WaitForUiNodeProps, WaitForNode];

export enum JourneyUiNodeType {
  JourneyUiNodeDefinitionProps = "JourneyUiNodeDefinitionProps",
  JourneyUiNodeEmptyProps = "JourneyUiNodeEmptyProps",
  JourneyUiNodeLabelProps = "JourneyUiNodeLabelProps",
}

export const JourneyUiNodeDefinitionProps = Type.Object({
  type: Type.Literal(JourneyUiNodeType.JourneyUiNodeDefinitionProps),
  nodeTypeProps: JourneyUiNodeTypeProps,
});

export type JourneyUiNodeDefinitionProps = Static<
  typeof JourneyUiNodeDefinitionProps
>;

export const JourneyUiNodeEmptyProps = Type.Object({
  type: Type.Literal(JourneyUiNodeType.JourneyUiNodeEmptyProps),
});

export type JourneyUiNodeEmptyProps = Static<typeof JourneyUiNodeEmptyProps>;

export const JourneyUiNodeLabelProps = Type.Object({
  type: Type.Literal(JourneyUiNodeType.JourneyUiNodeLabelProps),
  title: Type.String(),
});

export type JourneyUiNodeLabelProps = Static<typeof JourneyUiNodeLabelProps>;

export const JourneyUiNodePresentationalProps = Type.Union([
  JourneyUiNodeLabelProps,
  JourneyUiNodeEmptyProps,
]);

export type JourneyUiNodePresentationalProps = Static<
  typeof JourneyUiNodePresentationalProps
>;

export const JourneyNodeUiProps = Type.Union([
  JourneyUiNodeDefinitionProps,
  JourneyUiNodePresentationalProps,
]);

export type JourneyNodeUiProps = Static<typeof JourneyNodeUiProps>;

export const TimeUnitEnum = {
  seconds: "seconds",
  minutes: "minutes",
  hours: "hours",
  days: "days",
  weeks: "weeks",
} as const;

export const TimeUnit = Type.KeyOf(Type.Const(TimeUnitEnum));

export type TimeUnit = Static<typeof TimeUnit>;

export enum JourneyUiEdgeType {
  JourneyUiDefinitionEdgeProps = "JourneyUiDefinitionEdgeProps",
  JourneyUiPlaceholderEdgeProps = "JourneyUiPlaceholderEdgeProps",
}

export const JourneyUiDefinitionEdgeProps = Type.Object({
  type: Type.Literal(JourneyUiEdgeType.JourneyUiDefinitionEdgeProps),
  disableMarker: Type.Optional(Type.Boolean()),
});

export type JourneyUiDefinitionEdgeProps = Static<
  typeof JourneyUiDefinitionEdgeProps
>;

export const JourneyUiPlaceholderEdgeProps = Type.Object({
  type: Type.Literal(JourneyUiEdgeType.JourneyUiPlaceholderEdgeProps),
});

export type JourneyUiPlaceholderEdgeProps = Static<
  typeof JourneyUiPlaceholderEdgeProps
>;

export const JourneyUiEdgeProps = Type.Union([
  JourneyUiDefinitionEdgeProps,
  JourneyUiPlaceholderEdgeProps,
]);

export type JourneyUiEdgeProps = Static<typeof JourneyUiEdgeProps>;

export const JourneyUiDraftEdge = Type.Object({
  source: Type.String(),
  target: Type.String(),
  data: JourneyUiEdgeProps,
});

export type JourneyUiDraftEdge = Static<typeof JourneyUiDraftEdge>;

export const JourneyUiDraftNode = Type.Object({
  id: Type.String(),
  data: JourneyNodeUiProps,
});

export type JourneyUiDraftNode = Static<typeof JourneyUiDraftNode>;

export const JourneyDraft = Type.Object({
  nodes: Type.Array(JourneyUiDraftNode),
  edges: Type.Array(JourneyUiDraftEdge),
});

export type JourneyDraft = Static<typeof JourneyDraft>;

export const JourneyResourceStatus = Type.KeyOf(
  Type.Const(JourneyResourceStatusEnum),
);

export type JourneyResourceStatus = Static<typeof JourneyResourceStatus>;

const baseJourneyResource = {
  id: Type.String(),
  workspaceId: Type.String(),
  name: Type.String(),
  canRunMultiple: Type.Optional(Type.Boolean()),
  updatedAt: Type.Number(),
  draft: Type.Optional(JourneyDraft),
} as const;

export const NotStartedJourneyResource = Type.Object({
  ...baseJourneyResource,
  status: Type.Literal(JourneyResourceStatusEnum.NotStarted),
  definition: Type.Optional(JourneyDefinition),
});

export type NotStartedJourneyResource = Static<
  typeof NotStartedJourneyResource
>;

export const HasStartedJourneyResource = Type.Object({
  ...baseJourneyResource,
  status: Type.Union([
    Type.Literal(JourneyResourceStatusEnum.Running),
    Type.Literal(JourneyResourceStatusEnum.Paused),
    Type.Literal(JourneyResourceStatusEnum.Broadcast),
  ]),
  definition: JourneyDefinition,
});

export type HasStartedJourneyResource = Static<
  typeof HasStartedJourneyResource
>;

export const JourneyResource = Type.Union([
  NotStartedJourneyResource,
  HasStartedJourneyResource,
]);

export type JourneyResource = Static<typeof JourneyResource>;

const Timestamps = Type.Object({
  createdAt: Type.Number(),
  updatedAt: Type.Number(),
});

export const SavedHasStartedJourneyResource = Type.Composite([
  HasStartedJourneyResource,
  Timestamps,
]);

export type SavedHasStartedJourneyResource = Static<
  typeof SavedHasStartedJourneyResource
>;

export const SavedNotStartedJourneyResource = Type.Composite([
  NotStartedJourneyResource,
  Timestamps,
]);

export type SavedNotStartedJourneyResource = Static<
  typeof SavedNotStartedJourneyResource
>;

export const SavedJourneyResource = Type.Union([
  SavedNotStartedJourneyResource,
  SavedHasStartedJourneyResource,
]);

export type SavedJourneyResource = Static<typeof SavedJourneyResource>;

export const UpsertJourneyResource = Type.Composite([
  IdOrName,
  Type.Object({
    workspaceId: Type.String(),
    draft: Type.Optional(Nullable(JourneyDraft)),
  }),
  Type.Partial(
    Type.Omit(
      Type.Object({
        ...baseJourneyResource,
        definition: JourneyDefinition,
        status: Type.Enum(JourneyResourceStatusEnum),
      }),
      ["draft"],
    ),
  ),
]);

export type UpsertJourneyResource = Static<typeof UpsertJourneyResource>;

export const GetJourneysRequest = Type.Object({
  workspaceId: Type.String(),
  getPartial: Type.Optional(Type.Boolean()),
  ids: Type.Optional(Type.Array(Type.String())),
  resourceType: Type.Optional(Type.Enum(ResourceTypeEnum)),
});

export type GetJourneysRequest = Static<typeof GetJourneysRequest>;

export const GetJourneysResponseItem = Type.Composite([
  Type.Omit(SavedJourneyResource, ["definition", "draft"]),
  Type.Partial(Type.Pick(SavedJourneyResource, ["definition", "draft"])),
]);

export type GetJourneysResponseItem = Static<typeof GetJourneysResponseItem>;

export const GetJourneysResponse = Type.Object({
  journeys: Type.Array(GetJourneysResponseItem),
});

export type GetJourneysResponse = Static<typeof GetJourneysResponse>;

export const EmptyResponse = Type.String({
  description: "An empty String",
});

export type EmptyResponse = Static<typeof EmptyResponse>;

export const DeleteJourneyRequest = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
});

export type DeleteJourneyRequest = Static<typeof DeleteJourneyRequest>;

export const UserPropertyResource = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  name: Type.String(),
  definition: UserPropertyDefinition,
  exampleValue: Type.Optional(Type.String()),
  updatedAt: Type.Number(),
  lastRecomputed: Type.Optional(Type.Number()),
});

export type UserPropertyResource = Static<typeof UserPropertyResource>;

export const SavedUserPropertyResource = Type.Composite([
  UserPropertyResource,
  Type.Object({
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    definitionUpdatedAt: Type.Number(),
  }),
]);

export type SavedUserPropertyResource = Static<
  typeof SavedUserPropertyResource
>;

export const UpsertUserPropertyResource = Type.Intersect([
  Type.Omit(Type.Partial(UserPropertyResource), ["name"]),
  Type.Pick(UserPropertyResource, ["name", "workspaceId"]),
]);

export type UpsertUserPropertyResource = Static<
  typeof UpsertUserPropertyResource
>;

export const DeleteUserPropertyRequest = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
});

export type DeleteUserPropertyRequest = Static<
  typeof DeleteUserPropertyRequest
>;

export const ReadAllUserPropertiesRequest = Type.Object({
  workspaceId: Type.String(),
});

export type ReadAllUserPropertiesRequest = Static<
  typeof ReadAllUserPropertiesRequest
>;

export const ReadAllUserPropertiesResponse = Type.Object({
  userProperties: Type.Array(SavedUserPropertyResource),
});

export type ReadAllUserPropertiesResponse = Static<
  typeof ReadAllUserPropertiesResponse
>;

export const CursorDirection = Type.Enum(CursorDirectionEnum);

export const GetUsersUserPropertyFilter = Type.Array(
  Type.Object({
    id: Type.String(),
    values: Type.Array(Type.String()),
  }),
);

export type GetUsersUserPropertyFilter = Static<
  typeof GetUsersUserPropertyFilter
>;

export const GetUsersRequest = Type.Object({
  cursor: Type.Optional(Type.String()),
  segmentFilter: Type.Optional(Type.Array(Type.String())),
  limit: Type.Optional(Type.Number()),
  direction: Type.Optional(CursorDirection),
  userIds: Type.Optional(Type.Array(UserId)),
  subscriptionGroupFilter: Type.Optional(Type.Array(Type.String())),
  userPropertyFilter: Type.Optional(GetUsersUserPropertyFilter),
  workspaceId: Type.String(),
});

export type GetUsersRequest = Static<typeof GetUsersRequest>;

const GetUsersResponseItem = Type.Object({
  id: Type.String(),
  // map from id to name and value
  properties: Type.Record(
    Type.String(),
    Type.Object({
      name: Type.String(),
      value: Type.Any(),
    }),
  ),
  segments: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
    }),
  ),
});

export type GetUsersResponseItem = Static<typeof GetUsersResponseItem>;

export const GetUsersResponse = Type.Object({
  users: Type.Array(GetUsersResponseItem),
  previousCursor: Type.Optional(Type.String()),
  nextCursor: Type.Optional(Type.String()),
  userCount: Type.Literal(0),
});

export type GetUsersResponse = Static<typeof GetUsersResponse>;

export const GetUsersCountResponse = Type.Object({
  userCount: Type.Number(),
});

export type GetUsersCountResponse = Static<typeof GetUsersCountResponse>;

export const GetUsersCountRequest = Type.Omit(GetUsersRequest, [
  "cursor",
  "limit",
  "direction",
]);

export type GetUsersCountRequest = Static<typeof GetUsersCountRequest>;

export const BaseMessageResponse = Type.Object({
  message: Type.String(),
});

export type BaseMessageResponse = Static<typeof BaseMessageResponse>;

export const BadRequestResponse = BaseMessageResponse;

export enum SourceControlProviderEnum {
  GitHub = "github",
}

export const SourceControlProvider = Type.Enum(SourceControlProviderEnum);

export const WorkspaceId = Type.String();

export type WorkspaceId = Static<typeof WorkspaceId>;

export const UserUploadEmailRow = Type.Intersect([
  Type.Record(Type.String(), Type.String()),
  Type.Object({
    email: Type.String({ minLength: 1 }),
  }),
]);

export type UserUploadEmailRow = Static<typeof UserUploadEmailRow>;

export const BaseUserUploadRow = Type.Intersect([
  Type.Record(Type.String(), Type.String()),
  Type.Object({
    id: Type.String({ minLength: 1 }),
  }),
]);

export type BaseUserUploadRow = Static<typeof BaseUserUploadRow>;

export const UserUploadRow = Type.Union([
  BaseUserUploadRow,
  UserUploadEmailRow,
]);

export type UserUploadRow = Static<typeof UserUploadRow>;

export const RoleEnum = {
  Admin: "Admin",
  WorkspaceManager: "WorkspaceManager",
  Author: "Author",
  Viewer: "Viewer",
} as const;

export type Role = (typeof RoleEnum)[keyof typeof RoleEnum];
export const Role = Type.Enum(RoleEnum);

export const WorkspaceMemberResource = Type.Object({
  id: Type.String(),
  email: Type.String(),
  emailVerified: Type.Boolean(),
  picture: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  nickname: Type.Optional(Type.String()),
  createdAt: Type.String(),
});

export type WorkspaceMemberResource = Static<typeof WorkspaceMemberResource>;

export const WorkspaceMemberRoleResource = Type.Object({
  role: Role,
  workspaceMemberId: Type.String(),
  workspaceId: Type.String(),
  workspaceName: Type.String(),
});

export type WorkspaceMemberRoleResource = Static<
  typeof WorkspaceMemberRoleResource
>;

export const CreateWorkspaceMemberRoleRequest = Type.Object({
  workspaceId: Type.String(),
  email: Type.String(),
  role: Role,
});

export type CreateWorkspaceMemberRoleRequest = Static<
  typeof CreateWorkspaceMemberRoleRequest
>;

export const UpdateWorkspaceMemberRoleRequest = Type.Object({
  workspaceId: Type.String(),
  email: Type.String(),
  role: Role,
});

export type UpdateWorkspaceMemberRoleRequest = Static<
  typeof UpdateWorkspaceMemberRoleRequest
>;

export const DeleteWorkspaceMemberRoleRequest = Type.Object({
  workspaceId: Type.String(),
  email: Type.String(),
});

export type DeleteWorkspaceMemberRoleRequest = Static<
  typeof DeleteWorkspaceMemberRoleRequest
>;

export const GetWorkspaceMemberRolesRequest = Type.Object({
  workspaceId: Type.String(),
});

export type GetWorkspaceMemberRolesRequest = Static<
  typeof GetWorkspaceMemberRolesRequest
>;

export const WorkspaceMemberWithRoles = Type.Object({
  member: WorkspaceMemberResource,
  roles: Type.Array(WorkspaceMemberRoleResource),
});

export type WorkspaceMemberWithRoles = Static<typeof WorkspaceMemberWithRoles>;

export const GetWorkspaceMemberRolesResponse = Type.Object({
  memberRoles: Type.Array(WorkspaceMemberWithRoles),
});

export type GetWorkspaceMemberRolesResponse = Static<
  typeof GetWorkspaceMemberRolesResponse
>;

export interface DFRequestContext {
  workspace: WorkspaceResource & {
    type: WorkspaceTypeApp;
    parentWorkspaceId?: string;
  };
  member: WorkspaceMemberResource;
  memberRoles: WorkspaceMemberRoleResource[];
}

export const UserSubscriptionResource = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isSubscribed: Type.Boolean(),
  channel: Type.Enum(ChannelType),
});

export type UserSubscriptionResource = Static<typeof UserSubscriptionResource>;

export const SubscriptionParams = Type.Object(
  {
    w: Type.String({ description: "Workspace Id." }),
    i: Type.String({
      description: 'Identifier value for channel e.g. "name@email.com".',
    }),
    ik: Type.String({
      description: 'Identifier key for channel e.g. "email".',
    }),
    h: Type.String({
      description:
        "Subscription change hash, used to authenticate subscription changes.",
    }),
    s: Type.Optional(
      Type.String({
        description: "Subscription group Id.",
      }),
    ),
    sub: Type.Optional(
      Type.Union([
        Type.Literal("1", {
          description: "Subscribing user to subscription group.",
        }),
        Type.Literal("0", {
          description: "Unsubscribing user from subscription group.",
        }),
      ]),
    ),
    isPreview: Type.Optional(
      Type.String({
        description: "Preview mode flag to skip subscription updates.",
      }),
    ),
  },
  {
    description:
      "Subscription management parameters with shorted parameter names for efficient query param serialization.",
  },
);

export type SubscriptionParams = Static<typeof SubscriptionParams>;

export const UserSubscriptionLookup = Type.Object({
  workspaceId: Type.String({ description: "Workspace Id." }),
  hash: Type.String({
    description:
      "Subscription change hash, used to authenticate subscription changes.",
  }),
  identifier: Type.String({
    description: "Identifier value for channel.",
    examples: ["user@email.com"],
  }),
  identifierKey: Type.String({
    description: "Identifier key for channel.",
    examples: ["email"],
  }),
});

export type UserSubscriptionLookup = Static<typeof UserSubscriptionLookup>;

export const UserSubscriptionsUpdate = Type.Intersect([
  UserSubscriptionLookup,
  Type.Object({
    changes: Type.Record(Type.String(), Type.Boolean(), {
      description: "Subscription changes.",
    }),
  }),
]);

export type UserSubscriptionsUpdate = Static<typeof UserSubscriptionsUpdate>;

export const UserSubscriptionsAdminUpdate = Type.Object({
  workspaceId: Type.String(),
  userId: Type.String(),
  changes: Type.Array(
    Type.Object({
      subscriptionGroupId: Type.String(),
      isSubscribed: Type.Boolean(),
    }),
  ),
});

export type UserSubscriptionsAdminUpdate = Static<
  typeof UserSubscriptionsAdminUpdate
>;

export enum RenderMessageTemplateType {
  Emailo = "Emailo",
  Mjml = "Mjml",
  PlainText = "PlainText",
}

export const RenderMessageTemplateRequestContentMjml = Type.Object({
  type: Type.Literal(RenderMessageTemplateType.Mjml),
  value: Type.String(),
});

export type RenderMessageTemplateRequestContentMjml = Static<
  typeof RenderMessageTemplateRequestContentMjml
>;

export const RenderMessageTemplateRequestContentPlainText = Type.Object({
  type: Type.Literal(RenderMessageTemplateType.PlainText),
  value: Type.String(),
});

export type RenderMessageTemplateRequestContentPlainText = Static<
  typeof RenderMessageTemplateRequestContentPlainText
>;

export const RenderMessageTemplateRequestContentEmailo = Type.Object({
  type: Type.Literal(RenderMessageTemplateType.Emailo),
  value: LowCodeEmailJsonBody,
});

export type RenderMessageTemplateRequestContentEmailo = Static<
  typeof RenderMessageTemplateRequestContentEmailo
>;

export const RenderMessageTemplateRequestContent = Type.Union([
  RenderMessageTemplateRequestContentPlainText,
  RenderMessageTemplateRequestContentEmailo,
  RenderMessageTemplateRequestContentMjml,
]);

export type RenderMessageTemplateRequestContent = Static<
  typeof RenderMessageTemplateRequestContent
>;

export const RenderMessageTemplateRequestContents = Type.Record(
  Type.String(),
  RenderMessageTemplateRequestContent,
);

export type RenderMessageTemplateRequestContents = Static<
  typeof RenderMessageTemplateRequestContents
>;

export const RenderMessageTemplateRequest = Type.Object({
  workspaceId: Type.String(),
  channel: Type.Enum(ChannelType),
  subscriptionGroupId: Type.Optional(Type.String()),
  contents: RenderMessageTemplateRequestContents,
  userProperties: Type.Record(Type.String(), Type.Any()),
  tags: Type.Optional(Type.Record(Type.String(), Type.String())),
});

export type RenderMessageTemplateRequest = Static<
  typeof RenderMessageTemplateRequest
>;

export const RenderMessageTemplateResponseContent = JsonResult(
  Type.String(),
  Type.String(),
);

export type RenderMessageTemplateResponseContent = Static<
  typeof RenderMessageTemplateResponseContent
>;

export const RenderMessageTemplateResponse = Type.Object({
  contents: Type.Record(Type.String(), RenderMessageTemplateResponseContent),
});

export type RenderMessageTemplateResponse = Static<
  typeof RenderMessageTemplateResponse
>;

export const DeleteSubscriptionGroupRequest = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
});

export type DeleteSubscriptionGroupRequest = Static<
  typeof DeleteSubscriptionGroupRequest
>;

export enum AppFileType {
  Base64Encoded = "Base64Encoded",
  BlobStorage = "BlobStorage",
}

export const Base64EncodedFile = Type.Object(
  {
    type: Type.Literal(AppFileType.Base64Encoded),
    name: Type.String(),
    mimeType: Type.String(),
    data: Type.String(),
  },
  {
    description:
      "Base64 encoded file. Converted to a BlobStorage file before persisted.",
  },
);

export type Base64EncodedFile = Static<typeof Base64EncodedFile>;

export const BlobStorageFile = Type.Object(
  {
    type: Type.Literal(AppFileType.BlobStorage),
    key: Type.String(),
    name: Type.String(),
    mimeType: Type.String(),
  },
  {
    description: "File stored in blob storage. Should only be used internally.",
  },
);

export type BlobStorageFile = Static<typeof BlobStorageFile>;

export const AppDataFileInternal = Type.Union([
  Base64EncodedFile,
  BlobStorageFile,
]);

export type AppDataFileInternal = Static<typeof AppDataFileInternal>;

export const AppDataFile = Type.Union([Base64EncodedFile], {
  description: "File associated with user event.",
});

export const AppDataFiles = Type.Optional(Type.Array(AppDataFile));

export type AppDataFiles = Static<typeof AppDataFiles>;

export const AppDataContext = Type.Optional(
  Type.Record(Type.String(), Type.Any(), {
    description:
      "Provides metadata about the user submitting the event and the context in which the event occurred.",
    examples: [
      {
        ip: "192.0.2.1",
      },
    ],
  }),
);

export type AppDataContext = Static<typeof AppDataContext>;

export const BaseAppData = {
  messageId: Type.String({
    description:
      "Unique identifier for the message, used as an idempotency key for safe retries. Can provide a UUID.",
    examples: ["23d04926-78e5-4ebc-853f-f26c84ff629e"],
  }),
  timestamp: Type.Optional(
    Type.String({
      description:
        "ISO 8601 formatted timestamp of when the event occurred. If not provided, the current server time will be used.",
      examples: ["2024-04-22T07:00:00.000Z"],
    }),
  ),
};

export const BaseIdentifyData = {
  ...BaseAppData,
  context: AppDataContext,
  traits: Type.Optional(Traits),
};

export const BaseBatchIdentifyData = {
  ...BaseAppData,
  type: Type.Literal(EventType.Identify),
  traits: Type.Optional(Traits),
};

const KnownIdentifyData = Type.Object({
  ...BaseIdentifyData,
  userId: UserId,
});

export type KnownIdentifyData = Static<typeof KnownIdentifyData>;

const AnonymousIdentifyData = Type.Object({
  ...BaseIdentifyData,
  anonymousId: AnonymousId,
});

export type AnonymousIdentifyData = Static<typeof AnonymousIdentifyData>;

export const IdentifyData = Type.Union([
  KnownIdentifyData,
  AnonymousIdentifyData,
]);

export type IdentifyData = Static<typeof IdentifyData>;

export const KnownBatchIdentifyData = Type.Object({
  ...BaseBatchIdentifyData,
  userId: UserId,
});

export type KnownBatchIdentifyData = Static<typeof KnownBatchIdentifyData>;

export const AnonymousBatchIdentifyData = Type.Object({
  ...BaseBatchIdentifyData,
  anonymousId: AnonymousId,
});

export type AnonymousBatchIdentifyData = Static<
  typeof AnonymousBatchIdentifyData
>;

export const BatchIdentifyData = Type.Union([
  KnownBatchIdentifyData,
  AnonymousBatchIdentifyData,
]);

export type BatchIdentifyData = Static<typeof BatchIdentifyData>;

export const TrackEventName = Type.String({
  description: "Name of the action that a user has performed.",
  examples: ["COURSE_CLICKED"],
});

export type TrackEventName = Static<typeof TrackEventName>;

export const TrackEventProperties = Type.Record(Type.String(), Type.Any(), {
  description:
    "Free-form dictionary of properties of the event, like revenue or product name. Can contain arbitrary JSON values.",
  examples: [
    {
      title: "Intro to customer engagement",
    },
  ],
});

export type TrackEventProperties = Static<typeof TrackEventProperties>;

export const BaseTrackData = {
  ...BaseAppData,
  files: AppDataFiles,
  event: TrackEventName,
  properties: Type.Optional(TrackEventProperties),
  context: AppDataContext,
};

export const BaseBatchTrackData = {
  ...BaseAppData,
  files: AppDataFiles,
  event: TrackEventName,
  properties: Type.Optional(TrackEventProperties),
  type: Type.Literal(EventType.Track),
};

export const KnownTrackData = Type.Object({
  ...BaseTrackData,
  context: AppDataContext,
  userId: UserId,
});

export type KnownTrackData = Static<typeof KnownTrackData>;

export const AnonymousTrackData = Type.Object({
  ...BaseTrackData,
  context: AppDataContext,
  anonymousId: AnonymousId,
});

export type AnonymousTrackData = Static<typeof AnonymousTrackData>;

export const TrackData = Type.Union([KnownTrackData, AnonymousTrackData]);

export type TrackData = Static<typeof TrackData>;

export const KnownBatchTrackData = Type.Object({
  ...BaseBatchTrackData,
  userId: UserId,
});

export type KnownBatchTrackData = Static<typeof KnownBatchTrackData>;

export const AnonymousBatchTrackData = Type.Object({
  ...BaseBatchTrackData,
  anonymousId: AnonymousId,
});

export type AnonymousBatchTrackData = Static<typeof AnonymousBatchTrackData>;

export const BatchTrackData = Type.Union([
  KnownBatchTrackData,
  AnonymousBatchTrackData,
]);

export type BatchTrackData = Static<typeof BatchTrackData>;

export const GroupEventTraits = Type.Record(Type.String(), Type.Any(), {
  description: "Traits of the group.",
});

export type GroupEventTraits = Static<typeof GroupEventTraits>;

export const BaseGroupData = {
  ...BaseAppData,
  groupId: Type.String(),
  assigned: Type.Optional(Type.Boolean()),
  traits: Type.Optional(GroupEventTraits),
  context: AppDataContext,
};

export const BaseBatchGroupData = {
  ...BaseAppData,
  groupId: Type.String(),
  assigned: Type.Optional(Type.Boolean()),
  traits: Type.Optional(GroupEventTraits),
  type: Type.Literal(EventType.Group),
};

export const KnownGroupData = Type.Object({
  ...BaseGroupData,
  context: AppDataContext,
  userId: UserId,
});

export type KnownGroupData = Static<typeof KnownGroupData>;

export const AnonymousGroupData = Type.Object({
  ...BaseGroupData,
  context: AppDataContext,
  anonymousId: AnonymousId,
});

export type AnonymousGroupData = Static<typeof AnonymousGroupData>;

export const GroupData = Type.Union([KnownGroupData, AnonymousGroupData]);

export type GroupData = Static<typeof GroupData>;

export const KnownBatchGroupData = Type.Object({
  ...BaseBatchGroupData,
  userId: UserId,
});

export type KnownBatchGroupData = Static<typeof KnownBatchGroupData>;

export const AnonymousBatchGroupData = Type.Object({
  ...BaseBatchGroupData,
  anonymousId: AnonymousId,
});

export type AnonymousBatchGroupData = Static<typeof AnonymousBatchGroupData>;

export const BatchGroupData = Type.Union([
  KnownBatchGroupData,
  AnonymousBatchGroupData,
]);

export type BatchGroupData = Static<typeof BatchGroupData>;

export const PageName = Type.String({
  description: "Name of the page visited by the user.",
  examples: ["Home"],
});

export type PageName = Static<typeof PageName>;

export const PageProperties = Type.Record(Type.String(), Type.Any(), {
  description:
    "Free-form dictionary of properties of the page, like url and referrer. Can contain arbitrary JSON values.",
  examples: [
    {
      title: "My Site",
      url: "http://www.site.com",
    },
  ],
});

export const BasePageData = {
  ...BaseAppData,
  name: Type.Optional(PageName),
  properties: Type.Optional(PageProperties),
  context: AppDataContext,
};

export const BaseBatchPageData = {
  ...BaseAppData,
  name: Type.Optional(PageName),
  properties: Type.Optional(PageProperties),
  type: Type.Literal(EventType.Page),
};

export const KnownPageData = Type.Object({
  ...BasePageData,
  userId: UserId,
});

export type KnownPageData = Static<typeof KnownPageData>;

export const AnonymousPageData = Type.Object({
  ...BasePageData,
  anonymousId: AnonymousId,
});

export type AnonymousPageData = Static<typeof AnonymousPageData>;

export const PageData = Type.Union([KnownPageData, AnonymousPageData]);

export type PageData = Static<typeof PageData>;

export const BatchPageData = Type.Union([
  Type.Object({
    ...BaseBatchPageData,
    userId: UserId,
  }),
  Type.Object({
    ...BaseBatchPageData,
    anonymousId: AnonymousId,
  }),
]);

export type BatchPageData = Static<typeof BatchPageData>;

export const ScreenName = Type.String({
  description: "Name of the screen visited by the user.",
  examples: ["Home"],
});

export type ScreenName = Static<typeof ScreenName>;

export const ScreenProperties = Type.Record(Type.String(), Type.Any(), {
  description: "Free-form dictionary of properties of the screen, like title.",
  examples: [
    {
      title: "My Screen",
    },
  ],
});

export type ScreenProperties = Static<typeof ScreenProperties>;

export const BaseScreenData = {
  ...BaseAppData,
  context: AppDataContext,
  name: Type.Optional(ScreenName),
  properties: Type.Optional(ScreenProperties),
};

export const BaseBatchScreenData = {
  ...BaseAppData,
  name: Type.Optional(ScreenName),
  properties: Type.Optional(ScreenProperties),
  type: Type.Literal(EventType.Screen),
};

export const KnownScreenData = Type.Object({
  ...BaseScreenData,
  userId: UserId,
});

export type KnownScreenData = Static<typeof KnownScreenData>;

export const AnonymousScreenData = Type.Object({
  ...BaseScreenData,
  anonymousId: AnonymousId,
});

export type AnonymousScreenData = Static<typeof AnonymousScreenData>;

export const ScreenData = Type.Union([KnownScreenData, AnonymousScreenData]);

export type ScreenData = Static<typeof ScreenData>;

export const BatchScreenData = Type.Union([
  Type.Object({
    ...BaseBatchScreenData,
    userId: UserId,
  }),
  Type.Object({
    ...BaseBatchScreenData,
    anonymousId: AnonymousId,
  }),
]);

export type BatchScreenData = Static<typeof BatchScreenData>;

const BatchItem = Type.Union([
  BatchIdentifyData,
  BatchTrackData,
  BatchPageData,
  BatchScreenData,
  BatchGroupData,
]);

export type BatchItem = Static<typeof BatchItem>;

export const BatchAppData = Type.Object(
  {
    batch: Type.Array(BatchItem),
    context: AppDataContext,
  },
  {
    examples: [
      {
        batch: [
          {
            type: "track",
            event: "Signed Up",
            userId: "1043",
            properties: {
              plan: "Enterprise",
            },
            messageId: "1ff51c9c-4929-45de-8914-3bb878be8c4a",
          },
          {
            type: "identify",
            userId: "532",
            traits: {
              email: "john@email.com",
            },
            messageId: "6f5f436d-8534-4070-8023-d18f8b78ed39",
          },
        ],
      },
    ],
  },
);

export type BatchAppData = Static<typeof BatchAppData>;

export const WriteKeyResource = Type.Object({
  writeKeyName: Type.String(),
  writeKeyValue: Type.String(),
  secretId: Type.String(),
  workspaceId: Type.String(),
});

export type WriteKeyResource = Static<typeof WriteKeyResource>;

export const UpsertWriteKeyResource = Type.Object({
  writeKeyName: Type.String(),
  workspaceId: Type.String(),
});
export type UpsertWriteKeyResource = Static<typeof UpsertWriteKeyResource>;

export const ListWriteKeyRequest = Type.Object({
  workspaceId: Type.String(),
});

export type ListWriteKeyRequest = Static<typeof ListWriteKeyRequest>;

export const ListWriteKeyResource = Type.Array(WriteKeyResource);

export type ListWriteKeyResource = Static<typeof ListWriteKeyResource>;

export const DeleteWriteKeyResource = Type.Object({
  writeKeyName: Type.String(),
  workspaceId: Type.String(),
});

export type DeleteWriteKeyResource = Static<typeof DeleteWriteKeyResource>;

export const UpsertSecretRequest = Type.Object({
  name: Type.String(),
  value: Type.Optional(Type.String()),
  configValue: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  workspaceId: Type.String(),
});

export type UpsertSecretRequest = Static<typeof UpsertSecretRequest>;

export const DeleteSecretRequest = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
});

export type DeleteSecretRequest = Static<typeof DeleteSecretRequest>;

export const ListSecretsRequest = Type.Object({
  workspaceId: Type.String(),
  names: Type.Optional(Type.Array(Type.String())),
});

export type ListSecretsRequest = Static<typeof ListSecretsRequest>;

export const SecretResource = Type.Object({
  name: Type.String(),
  value: Type.String(),
  workspaceId: Type.String(),
});

export type SecretResource = Static<typeof SecretResource>;

export const ValueError = Type.Object({
  path: Type.String(),
  value: Type.Unknown(),
  message: Type.String(),
});

export const UserUploadRowErrors = Type.Object({
  row: Type.Number(),
  error: Type.String(),
});

export type UserUploadRowErrors = Static<typeof UserUploadRowErrors>;

export const CsvUploadValidationError = Type.Object({
  message: Type.String(),
  rowErrors: Type.Optional(Type.Array(UserUploadRowErrors)),
});

export type CsvUploadValidationError = Static<typeof CsvUploadValidationError>;

export enum IntegrationType {
  Sync = "Sync",
}

export const SyncIntegration = Type.Object({
  type: Type.Literal(IntegrationType.Sync),
  subscribedSegments: Type.Array(Type.String()),
  subscribedUserProperties: Type.Array(Type.String()),
});

export type SyncIntegration = Static<typeof SyncIntegration>;

export const IntegrationDefinition = Type.Union([SyncIntegration]);

export type IntegrationDefinition = Static<typeof IntegrationDefinition>;

export const IntegrationResource = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  name: Type.String(),
  definition: IntegrationDefinition,
  enabled: Type.Boolean(),
});

export type IntegrationResource = Static<typeof IntegrationResource>;

export const UpsertIntegrationResource = Type.Composite([
  Type.Partial(Type.Pick(IntegrationResource, ["enabled", "definition"])),
  Type.Pick(IntegrationResource, ["workspaceId", "name"]),
]);

export type UpsertIntegrationResource = Static<
  typeof UpsertIntegrationResource
>;

export const OauthTokenResource = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  name: Type.String(),
  accessToken: Type.String(),
  refreshToken: Type.String(),
  expiresIn: Type.Number(),
  createdAt: Type.Number(),
  updatedAt: Type.Optional(Type.Number()),
});

export type OauthTokenResource = Static<typeof OauthTokenResource>;

export const BoolStr = Type.Union([
  Type.Literal("true"),
  Type.Literal("false"),
]);

export enum NodeStatsType {
  MessageNodeStats = "MessageNodeStats",
  SegmentSplitNodeStats = "SegmentSplitNodeStats",
  WaitForNodeStats = "WaitForNodeStats",
  DelayNodeStats = "DelayNodeStats",
}

export const EmailStats = Type.Object({
  type: Type.Literal(ChannelType.Email),
  deliveryRate: Type.Number(),
  openRate: Type.Number(),
  clickRate: Type.Number(),
  spamRate: Type.Number(),
});

export type EmailStats = Static<typeof EmailStats>;

export const SmsStats = Type.Object({
  type: Type.Literal(ChannelType.Sms),
  deliveryRate: Type.Number(),
  failRate: Type.Optional(Type.Number()),
});

export type SmsStats = Static<typeof SmsStats>;

export const WebhookStats = Type.Object({
  type: Type.Literal(ChannelType.Webhook),
  stats: Type.Record(Type.String(), Type.Number()),
});

export type WebhookStats = Static<typeof WebhookStats>;

export const MessageChannelStats = Type.Union([
  EmailStats,
  SmsStats,
  WebhookStats,
]);

export type MessageChannelStats = Static<typeof MessageChannelStats>;

export const BaseMessageNodeStats = Type.Object({
  sendRate: Type.Optional(Type.Number()),
  channelStats: Type.Optional(MessageChannelStats),
});

export type BaseMessageNodeStats = Static<typeof BaseMessageNodeStats>;

export const MessageNodeStats = Type.Composite([
  BaseMessageNodeStats,
  Type.Object({
    type: Type.Literal(NodeStatsType.MessageNodeStats),
    proportions: Type.Object({
      childEdge: Type.Number(),
    }),
  }),
]);

export type MessageNodeStats = Static<typeof MessageNodeStats>;

export const DelayNodeStats = Type.Object({
  type: Type.Literal(NodeStatsType.DelayNodeStats),
  proportions: Type.Object({
    childEdge: Type.Number(),
  }),
});

export type DelayNodeStats = Static<typeof DelayNodeStats>;

export const WaitForNodeStats = Type.Object({
  type: Type.Literal(NodeStatsType.WaitForNodeStats),
  proportions: Type.Object({
    segmentChildEdge: Type.Number(),
  }),
});

export type WaitForNodeStats = Static<typeof WaitForNodeStats>;

export const SegmentSplitNodeStats = Type.Object({
  type: Type.Literal(NodeStatsType.SegmentSplitNodeStats),
  proportions: Type.Object({
    falseChildEdge: Type.Number(),
  }),
});

export type SegmentSplitNodeStats = Static<typeof SegmentSplitNodeStats>;

export const NodeStats = Type.Union([
  MessageNodeStats,
  DelayNodeStats,
  WaitForNodeStats,
  SegmentSplitNodeStats,
]);

export type NodeStats = Static<typeof NodeStats>;

export const JourneyStats = Type.Object({
  journeyId: Type.String(),
  workspaceId: Type.String(),
  nodeStats: Type.Record(Type.String(), NodeStats),
});

export type JourneyStats = Static<typeof JourneyStats>;

export const JourneyStatsResponse = Type.Array(JourneyStats);

export type JourneyStatsResponse = Static<typeof JourneyStatsResponse>;

export const JourneyStatsRequest = Type.Object({
  workspaceId: Type.String(),
  journeyIds: Type.Optional(Type.Array(Type.String())),
});

export type JourneyStatsRequest = Static<typeof JourneyStatsRequest>;

export const TwilioSecret = Type.Object({
  type: Type.Literal(SmsProviderType.Twilio),
  accountSid: Type.Optional(Type.String()),
  messagingServiceSid: Type.Optional(Type.String()),
  authToken: Type.Optional(Type.String()),
  apiKeySid: Type.Optional(Type.String()),
  apiKeySecret: Type.Optional(Type.String()),
});

export type TwilioSecret = Static<typeof TwilioSecret>;

export const TestSmsSecret = Type.Object({
  type: Type.Literal(SmsProviderType.Test),
});

export type TestSmsSecret = Static<typeof TestSmsSecret>;

export const TestSmsProvider = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  type: Type.Literal(SmsProviderType.Test),
});

export type TestSmsProvider = Static<typeof TestSmsProvider>;

export const SmsProviderSecret = Type.Union([TwilioSecret, TestSmsSecret]);

export type SmsProviderSecret = Static<typeof SmsProviderSecret>;

export const TwilioSmsProvider = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  type: Type.Optional(Type.Literal(SmsProviderType.Twilio)),
});

export type TwilioSmsProvider = Static<typeof TwilioSmsProvider>;

export const PersistedSmsProvider = Type.Union([
  TwilioSmsProvider,
  TestSmsProvider,
]);

export type PersistedSmsProvider = Static<typeof PersistedSmsProvider>;

export const DefaultSmsProviderResource = Type.Object({
  workspaceId: Type.String(),
  smsProviderId: Type.String(),
});

export type DefaultSmsProviderResource = Static<
  typeof DefaultSmsProviderResource
>;

export const MessageTemplateTestErrorResponse = Type.Object({});

export const SmsTwilioSuccess = Type.Object({
  type: Type.Literal(SmsProviderType.Twilio),
  sid: Type.String(),
});

export type SmsTwilioSuccess = Static<typeof SmsTwilioSuccess>;

export const SmsTestSuccess = Type.Object({
  type: Type.Literal(SmsProviderType.Test),
});

export type SmsTestSuccess = Static<typeof SmsTestSuccess>;

export const SmsServiceProviderSuccess = Type.Union([
  SmsTwilioSuccess,
  SmsTestSuccess,
]);

export type SmsServiceProviderSuccess = Static<
  typeof SmsServiceProviderSuccess
>;

export const MessageSmsSuccess = Type.Composite([
  Type.Object({
    type: Type.Literal(ChannelType.Sms),
    provider: SmsServiceProviderSuccess,
    to: Type.String(),
  }),
  SmsContents,
]);

export type MessageSmsSuccess = Static<typeof MessageSmsSuccess>;

export const EmailTestSuccess = Type.Object({
  type: Type.Literal(EmailProviderType.Test),
});

export type EmailTestSuccess = Static<typeof EmailTestSuccess>;

export const EmailSendgridSuccess = Type.Object({
  type: Type.Literal(EmailProviderType.SendGrid),
});

export type EmailSendgridSuccess = Static<typeof EmailSendgridSuccess>;

export const EmailAmazonSesSuccess = Type.Object({
  type: Type.Literal(EmailProviderType.AmazonSes),
  messageId: Type.Optional(Type.String()),
});

export type EmailAmazonSesSuccess = Static<typeof EmailAmazonSesSuccess>;

export const EmailGmailSuccess = Type.Object({
  type: Type.Literal(EmailProviderType.Gmail),
  messageId: Type.String(),
  threadId: Type.String(),
});

export type EmailGmailSuccess = Static<typeof EmailGmailSuccess>;

export const EmailSmtpSuccess = Type.Object({
  type: Type.Literal(EmailProviderType.Smtp),
  messageId: Type.String(),
});

export type EmailSmtpSuccess = Static<typeof EmailSmtpSuccess>;

export const EmailResendSuccess = Type.Object({
  type: Type.Literal(EmailProviderType.Resend),
});

export type EmailResendSuccess = Static<typeof EmailResendSuccess>;

export const EmailPostMarkSuccess = Type.Object({
  type: Type.Literal(EmailProviderType.PostMark),
});

export type EmailPostMarkSuccess = Static<typeof EmailPostMarkSuccess>;

export const EmailMailChimpSuccess = Type.Object({
  type: Type.Literal(EmailProviderType.MailChimp),
});

export type EmailMailChimpSuccess = Static<typeof EmailMailChimpSuccess>;

export const EmailServiceProviderSuccess = Type.Union([
  EmailMailChimpSuccess,
  EmailSendgridSuccess,
  EmailAmazonSesSuccess,
  EmailPostMarkSuccess,
  EmailResendSuccess,
  EmailGmailSuccess,
  EmailSmtpSuccess,
  EmailTestSuccess,
]);

export type EmailServiceProviderSuccess = Static<
  typeof EmailServiceProviderSuccess
>;

export const MessageEmailSuccess = Type.Composite([
  Type.Object({
    type: Type.Literal(ChannelType.Email),
    provider: EmailServiceProviderSuccess,
    to: Type.String(),
    headers: Type.Optional(Type.Record(Type.String(), Type.String())),
    attachments: Type.Optional(
      Type.Array(
        Type.Object({
          mimeType: Type.String(),
          name: Type.String(),
        }),
      ),
    ),
  }),
  Type.Omit(CodeEmailContents, ["headers"]),
]);

export type MessageEmailSuccess = Static<typeof MessageEmailSuccess>;

export const WebhookResponse = Type.Object({
  status: Type.Optional(Type.Number()),
  headers: Type.Optional(
    Type.Record(
      Type.String(),
      Type.Union([
        Type.String(),
        Type.Number(),
        Type.Array(Type.String()),
        Type.Null(),
        Type.Boolean(),
      ]),
    ),
  ),
  body: Type.Optional(Type.Unknown()),
});

export type WebhookResponse = Static<typeof WebhookResponse>;

export const MessageWebhookSuccess = Type.Object({
  type: Type.Literal(ChannelType.Webhook),
  to: Type.String(),
  request: WebhookConfig,
  response: WebhookResponse,
});

export type MessageWebhookSuccess = Static<typeof MessageWebhookSuccess>;

export const MessageSkipped = Type.Object({
  type: Type.Literal(InternalEventType.MessageSkipped),
  message: Type.Optional(Type.String()),
});

export type MessageSkipped = Static<typeof MessageSkipped>;

export const MessageSendSuccessVariant = Type.Union([
  MessageEmailSuccess,
  MessageSmsSuccess,
  MessageWebhookSuccess,
]);

export type MessageSendSuccessVariant = Static<
  typeof MessageSendSuccessVariant
>;

export const MessageSendSuccessContents = Type.Object({
  variant: MessageSendSuccessVariant,
});

export type MessageSendSuccessContents = Static<
  typeof MessageSendSuccessContents
>;

export const MessageSendSuccess = Type.Composite([
  Type.Object({
    type: Type.Literal(InternalEventType.MessageSent),
  }),
  MessageSendSuccessContents,
]);

export type MessageSendSuccess = Static<typeof MessageSendSuccess>;

export const MessageSuccess = Type.Union([MessageSendSuccess, MessageSkipped]);

export type MessageSuccess = Static<typeof MessageSuccess>;

export const MessageTemplateTestResponse = JsonResult(
  MessageSuccess,
  Type.Object({
    suggestions: Type.Array(Type.String()),
    responseData: Type.Optional(Type.String()),
  }),
);

export type MessageTemplateTestResponse = Static<
  typeof MessageTemplateTestResponse
>;

export enum BadWorkspaceConfigurationType {
  MessageTemplateNotFound = "MessageTemplateNotFound",
  MessageTemplateMisconfigured = "MessageTemplateMisconfigured",
  MessageTemplateRenderError = "MessageTemplateRenderError",
  JourneyNotFound = "JourneyNotFound",
  SubscriptionGroupNotFound = "SubscriptionGroupNotFound",
  IdentifierNotFound = "IdentifierNotFound",
  SubscriptionSecretNotFound = "SubscriptionSecretNotFound",
  MessageServiceProviderNotFound = "MessageServiceProviderNotFound",
  MessageServiceProviderMisconfigured = "MessageServiceProviderMisconfigured",
}

export const MessageTemplateRenderError = Type.Object({
  type: Type.Literal(BadWorkspaceConfigurationType.MessageTemplateRenderError),
  field: Type.String(),
  error: Type.String(),
});

export type MessageTemplateRenderError = Static<
  typeof MessageTemplateRenderError
>;

export const BadWorkspaceConfigurationVariant = Type.Union([
  Type.Object({
    type: Type.Literal(BadWorkspaceConfigurationType.MessageTemplateNotFound),
  }),
  Type.Object({
    type: Type.Literal(
      BadWorkspaceConfigurationType.MessageTemplateMisconfigured,
    ),
    message: Type.String(),
  }),
  MessageTemplateRenderError,
  Type.Object({
    type: Type.Literal(BadWorkspaceConfigurationType.JourneyNotFound),
  }),
  Type.Object({
    type: Type.Literal(BadWorkspaceConfigurationType.SubscriptionGroupNotFound),
  }),
  Type.Object({
    type: Type.Literal(BadWorkspaceConfigurationType.IdentifierNotFound),
  }),
  Type.Object({
    type: Type.Literal(
      BadWorkspaceConfigurationType.SubscriptionSecretNotFound,
    ),
  }),
  Type.Object({
    type: Type.Literal(
      BadWorkspaceConfigurationType.MessageServiceProviderNotFound,
    ),
  }),
  Type.Object({
    type: Type.Literal(
      BadWorkspaceConfigurationType.MessageServiceProviderMisconfigured,
    ),
    message: Type.Optional(Type.String()),
  }),
]);

export type BadWorkspaceConfigurationVariant = Static<
  typeof BadWorkspaceConfigurationVariant
>;

export const MessageSendBadConfiguration = Type.Object({
  type: Type.Literal(InternalEventType.BadWorkspaceConfiguration),
  variant: BadWorkspaceConfigurationVariant,
});

export type MessageSendBadConfiguration = Static<
  typeof MessageSendBadConfiguration
>;

export const MessageSendgridServiceFailure = Type.Object({
  type: Type.Literal(EmailProviderType.SendGrid),
  status: Type.Optional(Type.Number()),
  body: Type.Optional(Type.String()),
});

export type MessageSendgridServiceFailure = Static<
  typeof MessageSendgridServiceFailure
>;

export const MessageAmazonSesServiceFailure = Type.Object({
  type: Type.Literal(EmailProviderType.AmazonSes),
  message: Type.Optional(Type.String()),
});

export type MessageAmazonSesServiceFailure = Static<
  typeof MessageAmazonSesServiceFailure
>;

export const SendGmailFailureTypeEnum = {
  NonRetryableGoogleError: "NonRetryableGoogleError",
  ConfigurationError: "ConfigurationError",
  ConstructionError: "ConstructionError",
  UnknownError: "UnknownError",
} as const;

export const SendGmailFailureType = Type.KeyOf(
  Type.Const(SendGmailFailureTypeEnum),
);

export type SendGmailFailureType = Static<typeof SendGmailFailureType>;

// --- TypeBox Schemas for Failure Reasons ---
// Individual error type schemas
export const GmailSendConfigurationError = Type.Object({
  type: Type.Literal(EmailProviderType.Gmail),
  errorType: Type.Literal(SendGmailFailureTypeEnum.ConfigurationError),
  message: Type.String(),
  details: Type.Optional(Type.Unknown()),
});

export type GmailSendConfigurationError = Static<
  typeof GmailSendConfigurationError
>;

export const GmailSendConstructionError = Type.Object({
  type: Type.Literal(EmailProviderType.Gmail),
  errorType: Type.Literal(SendGmailFailureTypeEnum.ConstructionError),
  message: Type.String(),
  details: Type.Optional(Type.Unknown()),
});

export type GmailSendConstructionError = Static<
  typeof GmailSendConstructionError
>;

export const GmailSendNonRetryableError = Type.Object({
  type: Type.Literal(EmailProviderType.Gmail),
  errorType: Type.Literal(SendGmailFailureTypeEnum.NonRetryableGoogleError),
  message: Type.String(),
  statusCode: Type.Optional(
    Type.Union([Type.String(), Type.Number(), Type.Null()]),
  ),
  googleErrorCode: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  googleErrorDescription: Type.Optional(
    Type.Union([Type.String(), Type.Null()]),
  ),
  details: Type.Optional(Type.Unknown()),
});

export type GmailSendNonRetryableError = Static<
  typeof GmailSendNonRetryableError
>;

export const GmailSendUnknownError = Type.Object({
  type: Type.Literal(EmailProviderType.Gmail),
  errorType: Type.Literal(SendGmailFailureTypeEnum.UnknownError),
  message: Type.String(),
  details: Type.Optional(Type.Unknown()),
});

export type GmailSendUnknownError = Static<typeof GmailSendUnknownError>;

// Union of all failure reason schemas
export const MessageGmailServiceFailure = Type.Union([
  GmailSendNonRetryableError,
  GmailSendConfigurationError,
  GmailSendConstructionError,
  GmailSendUnknownError,
]);

export type MessageGmailServiceFailure = Static<
  typeof MessageGmailServiceFailure
>;

export const MessageSmtpFailure = Type.Object({
  type: Type.Literal(EmailProviderType.Smtp),
  message: Type.String(),
});

export type MessageSmtpFailure = Static<typeof MessageSmtpFailure>;

export const MessageResendFailure = Type.Object({
  type: Type.Literal(EmailProviderType.Resend),
  message: Type.String(),
  name: Type.String(),
});

export type MessageResendFailure = Static<typeof MessageResendFailure>;

export const MessagePostMarkFailure = Type.Object({
  type: Type.Literal(EmailProviderType.PostMark),
  message: Type.String(),
  name: Type.String(),
});

export type MessagePostMarkFailure = Static<typeof MessagePostMarkFailure>;

export const MessageMailChimpFailure = Type.Object({
  type: Type.Literal(EmailProviderType.MailChimp),
  message: Type.String(),
  name: Type.String(),
});

export type MessageMailChimpFailure = Static<typeof MessageMailChimpFailure>;

export const EmailServiceProviderFailure = Type.Union([
  MessageSendgridServiceFailure,
  MessageMailChimpFailure,
  MessageAmazonSesServiceFailure,
  MessageResendFailure,
  MessagePostMarkFailure,
  MessageSmtpFailure,
  MessageGmailServiceFailure,
]);

export type EmailServiceProviderFailure = Static<
  typeof EmailServiceProviderFailure
>;

export const MessageEmailServiceFailure = Type.Object({
  type: Type.Literal(ChannelType.Email),
  provider: EmailServiceProviderFailure,
});

export type MessageEmailServiceFailure = Static<
  typeof MessageEmailServiceFailure
>;

export const MessageTwilioServiceFailure = Type.Object({
  type: Type.Literal(SmsProviderType.Twilio),
  message: Type.Optional(Type.String()),
});

export const SmsServiceProviderFailure = Type.Union([
  MessageTwilioServiceFailure,
]);

export type SmsServiceProviderFailure = Static<
  typeof SmsServiceProviderFailure
>;

export const MessageSmsServiceFailure = Type.Object({
  type: Type.Literal(ChannelType.Sms),
  provider: SmsServiceProviderFailure,
});

export type MessageSmsServiceFailure = Static<typeof MessageSmsServiceFailure>;

export const MessageWebhookServiceFailure = Type.Object({
  type: Type.Literal(ChannelType.Webhook),
  code: Type.Optional(Type.String()),
  response: Type.Optional(WebhookResponse),
});

export type MessageWebhookServiceFailure = Static<
  typeof MessageWebhookServiceFailure
>;

export const MessageServiceFailureVariant = Type.Union([
  MessageEmailServiceFailure,
  MessageSmsServiceFailure,
  MessageWebhookServiceFailure,
]);

export type MessageServiceFailureVariant = Static<
  typeof MessageServiceFailureVariant
>;

export const MessageServiceFailure = Type.Object({
  type: Type.Literal(InternalEventType.MessageFailure),
  variant: MessageServiceFailureVariant,
});

export type MessageServiceFailure = Static<typeof MessageServiceFailure>;

export enum SubscriptionChange {
  Subscribe = "Subscribe",
  Unsubscribe = "Unsubscribe",
}

export const UserSubscriptionAction = Nullable(Type.Enum(SubscriptionChange));

export type UserSubscriptionAction = Static<typeof UserSubscriptionAction>;

export enum MessageSkippedType {
  SubscriptionState = "SubscriptionState",
  MissingIdentifier = "MissingIdentifier",
}

export const MessageSkippedSubscriptionState = Type.Object({
  type: Type.Literal(MessageSkippedType.SubscriptionState),
  action: UserSubscriptionAction,
  subscriptionGroupType: Type.Enum(SubscriptionGroupType),
});

export type MessageSkippedSubscriptionState = Static<
  typeof MessageSkippedSubscriptionState
>;

export const MessageSkippedMissingIdentifier = Type.Object({
  type: Type.Literal(MessageSkippedType.MissingIdentifier),
  identifierKey: Type.String(),
});

export const MessageSkippedVariant = Type.Union([
  MessageSkippedSubscriptionState,
  MessageSkippedMissingIdentifier,
]);

export type MessageSkippedVariant = Static<typeof MessageSkippedVariant>;

export const MessageSkippedFailure = Type.Object({
  type: Type.Literal(InternalEventType.MessageSkipped),
  variant: MessageSkippedVariant,
});

export type MessageSkippedFailure = Static<typeof MessageSkippedFailure>;

export const MessageSendFailure = Type.Union([
  MessageSendBadConfiguration,
  MessageServiceFailure,
  MessageSkippedFailure,
]);

export type MessageSendFailure = Static<typeof MessageSendFailure>;

export const MessageSendResult = JsonResult(MessageSuccess, MessageSendFailure);

export type MessageSendResult = Static<typeof MessageSendResult>;

export type BackendMessageSendResult = Result<
  MessageSuccess,
  MessageSendFailure
>;

const BaseMessageTemplateTestRequest = {
  workspaceId: Type.String(),
  templateId: Type.String(),
  userProperties: Type.Record(Type.String(), Type.Any()),
  tags: Type.Optional(Type.Record(Type.String(), Type.String())),
} as const;

export const EmailMessageTemplateTestRequest = Type.Object({
  ...BaseMessageTemplateTestRequest,
  channel: Type.Literal(ChannelType.Email),
  provider: Type.Optional(Type.Enum(EmailProviderType)),
});

export type EmailMessageTemplateTestRequest = Static<
  typeof EmailMessageTemplateTestRequest
>;

export const SmsMessageTemplateTestRequest = Type.Object({
  ...BaseMessageTemplateTestRequest,
  channel: Type.Literal(ChannelType.Sms),
  provider: Type.Optional(Type.Enum(SmsProviderType)),
});

export type SmsMessageTemplateTestRequest = Static<
  typeof SmsMessageTemplateTestRequest
>;

export const MobilePushMessageTemplateTestRequest = Type.Object({
  ...BaseMessageTemplateTestRequest,
  channel: Type.Literal(ChannelType.MobilePush),
  provider: Type.Optional(Type.Enum(MobilePushProviderType)),
});

export type MobilePushMessageTemplateTestRequest = Static<
  typeof MobilePushMessageTemplateTestRequest
>;

export const WebhookMessageTemplateTestRequest = Type.Object({
  ...BaseMessageTemplateTestRequest,
  channel: Type.Literal(ChannelType.Webhook),
  provider: Type.Optional(Type.Null()),
});

export type WebhookMessageTemplateTestRequest = Static<
  typeof WebhookMessageTemplateTestRequest
>;

export const MessageTemplateTestRequest = Type.Union([
  EmailMessageTemplateTestRequest,
  SmsMessageTemplateTestRequest,
  MobilePushMessageTemplateTestRequest,
  WebhookMessageTemplateTestRequest,
]);

export type MessageTemplateTestRequest = Static<
  typeof MessageTemplateTestRequest
>;

export const GetTraitsRequest = Type.Object({
  workspaceId: Type.String(),
});

export type GetTraitsRequest = Static<typeof GetTraitsRequest>;

export const GetTraitsResponse = Type.Object({
  traits: Type.Array(Type.String()),
});

export type GetTraitsResponse = Static<typeof GetTraitsResponse>;

export const GetPropertiesRequest = Type.Object({
  workspaceId: Type.String(),
});

export type GetPropertiesRequest = Static<typeof GetPropertiesRequest>;

export const GetPropertiesResponse = Type.Object({
  properties: Type.Record(Type.String(), Type.Array(Type.String())),
});

export type GetPropertiesResponse = Static<typeof GetPropertiesResponse>;

const BaseDeliveryItem = Type.Object({
  sentAt: Type.String(),
  updatedAt: Type.String(),
  journeyId: Type.Optional(Type.String()),
  broadcastId: Type.Optional(Type.String()),
  userId: UserId,
  isAnonymous: Type.Optional(Type.Boolean()),
  originMessageId: Type.String(),
  triggeringMessageId: Type.Optional(Type.String()),
  templateId: Type.String(),
});

export const SearchDeliveriesResponseItem = Type.Union([
  // TODO implement sms status
  Type.Composite([
    Type.Object({
      status: Type.String(),
      variant: MessageSmsSuccess,
    }),
    BaseDeliveryItem,
  ]),
  Type.Composite([
    Type.Object({
      status: EmailEvent,
      variant: MessageEmailSuccess,
    }),
    BaseDeliveryItem,
  ]),
  Type.Composite([
    Type.Object({
      status: Type.String(),
      variant: MessageWebhookSuccess,
    }),
    BaseDeliveryItem,
  ]),
  // Deprecated
  Type.Composite([
    Type.Object({
      status: EmailEvent,
      to: Type.String(),
      channel: Type.Literal(ChannelType.Email),
    }),
    Type.Partial(CodeEmailContents),
    BaseDeliveryItem,
  ]),
]);

export type SearchDeliveriesResponseItem = Static<
  typeof SearchDeliveriesResponseItem
>;

export const SearchDeliveriesResponse = Type.Object({
  workspaceId: Type.String(),
  items: Type.Array(SearchDeliveriesResponseItem),
  cursor: Type.Optional(Type.String()),
  previousCursor: Type.Optional(Type.String()),
});

export type SearchDeliveriesResponse = Static<typeof SearchDeliveriesResponse>;

export const WorkspaceMemberSettingTypeEnum = {
  GmailTokens: "GmailTokens",
} as const;

export const WorkspaceMemberSettingType = Type.KeyOf(
  Type.Const(WorkspaceMemberSettingTypeEnum),
);

export type WorkspaceMemberSettingType = Static<
  typeof WorkspaceMemberSettingType
>;

export const GmailTokensWorkspaceMemberSetting = Type.Object({
  type: Type.Literal(WorkspaceMemberSettingTypeEnum.GmailTokens),
  email: Type.String(),
  accessToken: Type.Optional(Type.String()),
  accessTokenIv: Type.Optional(Type.String()),
  accessTokenAuthTag: Type.Optional(Type.String()),
  refreshToken: Type.Optional(Type.String()),
  refreshTokenIv: Type.Optional(Type.String()),
  refreshTokenAuthTag: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.Number()),
});

export type GmailTokensWorkspaceMemberSetting = Static<
  typeof GmailTokensWorkspaceMemberSetting
>;

export type WorkspaceMemberSettingSchema =
  typeof GmailTokensWorkspaceMemberSetting;

export const WorkspaceMemberSetting = Type.Union([
  GmailTokensWorkspaceMemberSetting,
]);

export type WorkspaceMemberSetting = Static<typeof WorkspaceMemberSetting>;

export const WorkspaceSettingSchemaRecord = {
  [WorkspaceMemberSettingTypeEnum.GmailTokens]:
    GmailTokensWorkspaceMemberSetting,
} as const;

export const WorkspaceSettingsResource = Type.Object({
  workspaceId: Type.String(),
  name: WorkspaceMemberSettingType,
  config: WorkspaceMemberSetting,
});

export type WorkspaceSettingsResource = Static<
  typeof WorkspaceSettingsResource
>;

export const GmailSecret = Type.Composite([
  Type.Pick(GmailTokensWorkspaceMemberSetting, [
    "email",
    "accessToken",
    "refreshToken",
    "expiresAt",
  ]),
  Type.Object({
    type: Type.Literal(EmailProviderType.Gmail),
  }),
]);

export type GmailSecret = Static<typeof GmailSecret>;

export const SendgridSecret = Type.Object({
  type: Type.Literal(EmailProviderType.SendGrid),
  apiKey: Type.Optional(Type.String()),
  webhookKey: Type.Optional(Type.String()),
});

export type SendgridSecret = Static<typeof SendgridSecret>;

export const PostMarkSecret = Type.Object({
  type: Type.Literal(EmailProviderType.PostMark),
  apiKey: Type.Optional(Type.String()),
  webhookKey: Type.Optional(Type.String()),
});

export type PostMarkSecret = Static<typeof PostMarkSecret>;

export const AmazonSesSecret = Type.Object({
  type: Type.Literal(EmailProviderType.AmazonSes),
  accessKeyId: Type.Optional(Type.String()),
  secretAccessKey: Type.Optional(Type.String()),
  region: Type.Optional(Type.String()),
});

export type AmazonSesSecret = Static<typeof AmazonSesSecret>;

export type AmazonSesConfig = Required<
  Pick<AmazonSesSecret, "accessKeyId" | "secretAccessKey" | "region">
>;

export const AmazonSesMailFields = Type.Object({
  from: Type.String(),
  to: Type.String(),
  subject: Type.String(),
  html: Type.String(),
  name: Type.Optional(Type.String()),
  replyTo: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Record(Type.String(), Type.Array(Type.String()))),
  cc: Type.Optional(Type.Array(Type.String())),
  bcc: Type.Optional(Type.Array(Type.String())),
  headers: Type.Optional(Type.Record(Type.String(), Type.String())),
});

export type AmazonSesMailFields = Static<typeof AmazonSesMailFields>;

export const TestEmailSecret = Type.Object({
  type: Type.Literal(EmailProviderType.Test),
});

export type TestEmailSecret = Static<typeof TestEmailSecret>;

export const ResendSecret = Type.Object({
  type: Type.Literal(EmailProviderType.Resend),
  apiKey: Type.Optional(Type.String()),
  webhookKey: Type.Optional(Type.String()),
});

export type ResendSecret = Static<typeof ResendSecret>;

export const MailChimpSecret = Type.Object({
  type: Type.Literal(EmailProviderType.MailChimp),
  apiKey: Type.Optional(Type.String()),
  webhookKey: Type.Optional(Type.String()),
});

export type MailChimpSecret = Static<typeof MailChimpSecret>;

export const SmtpSecret = Type.Object({
  type: Type.Literal(EmailProviderType.Smtp),
  host: Type.Optional(Type.String()),
  port: Type.Optional(Type.String()),
  username: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
});

export type SmtpSecret = Static<typeof SmtpSecret>;

export type SmtpSecretKey = keyof Omit<SmtpSecret, "type">;

export const WebhookSecret = Type.Intersect([
  Type.Record(Type.String(), Type.String()),
  Type.Object({
    type: Type.Literal(ChannelType.Webhook),
  }),
]);

export type WebhookSecret = Static<typeof WebhookSecret>;

export type WebhookProviderSecret = Static<typeof WebhookSecret>;

export const EmailProviderSecret = Type.Union([
  MailChimpSecret,
  SendgridSecret,
  PostMarkSecret,
  AmazonSesSecret,
  SmtpSecret,
  ResendSecret,
  TestEmailSecret,
  GmailSecret,
]);

export type EmailProviderSecret = Static<typeof EmailProviderSecret>;

export const WorkspaceWideEmailProviderSecret = Type.Exclude(
  EmailProviderSecret,
  GmailSecret,
);

export const DeleteUsersRequest = Type.Object({
  workspaceId: Type.String(),
  userIds: Type.Array(UserId),
});

export type DeleteUsersRequest = Static<typeof DeleteUsersRequest>;

export interface SubscriptionChangeEvent {
  type: EventType.Track;
  event: InternalEventType.SubscriptionChange;
  properties: {
    subscriptionId: string;
    action: SubscriptionChange;
  };
}

export interface SecretAvailabilityResource {
  workspaceId: string;
  name: string;
  value: boolean;
  configValue?: Record<string, boolean>;
}
export interface Resource {
  workspaceId: string;
  id: string;
}

export enum AdminApiKeyPermission {
  Admin = "Admin",
}

export enum AdminApiKeyType {
  AdminApiKey = "AdminApiKey",
}

export const AdminApiKeyDefinition = Type.Object({
  type: Type.Literal(AdminApiKeyType.AdminApiKey),
  key: Type.String(),
  permissions: Type.Array(
    Type.Union([Type.Literal(AdminApiKeyPermission.Admin)]),
  ),
});

export type AdminApiKeyDefinition = Static<typeof AdminApiKeyDefinition>;

export const AdminApiKeyResource = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
  name: Type.String(),
  createdAt: Type.Number(),
});

export type AdminApiKeyResource = Static<typeof AdminApiKeyResource>;

export const CreateAdminApiKeyRequest = Type.Object({
  workspaceId: Type.String(),
  name: Type.String(),
});

export type CreateAdminApiKeyRequest = Static<typeof CreateAdminApiKeyRequest>;

export const CreateAdminApiKeyResponse = Type.Composite([
  AdminApiKeyResource,
  Type.Object({
    apiKey: Type.String(),
  }),
]);

export type CreateAdminApiKeyResponse = Static<
  typeof CreateAdminApiKeyResponse
>;

export const DeleteAdminApiKeyRequest = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
});

export type DeleteAdminApiKeyRequest = Static<typeof DeleteAdminApiKeyRequest>;

export enum JourneyConstraintViolationType {
  WaitForNodeAndEventEntryNode = "WaitForNodeAndEventEntryNode",
  KeyedPerformedSegmentEntryNode = "KeyedPerformedSegmentEntryNode",
  CantStart = "CantStart",
}

export const JourneyConstraintViolation = Type.Object({
  type: Type.Enum(JourneyConstraintViolationType),
  message: Type.String(),
});

export type JourneyConstraintViolation = Static<
  typeof JourneyConstraintViolation
>;

export enum JourneyUpsertValidationErrorType {
  ConstraintViolation = "ConstraintViolation",
  StatusTransitionError = "StatusTransitionError",
  IdError = "IdError",
  UniqueConstraintViolation = "UniqueConstraintViolation",
  BadValues = "BadValues",
}

export const JourneyUpsertBadValuesError = Type.Object({
  type: Type.Literal(JourneyUpsertValidationErrorType.BadValues),
  message: Type.String(),
});

export type JourneyUpsertBadValuesError = Static<
  typeof JourneyUpsertBadValuesError
>;

export const JourneyUpsertValidationConstraintViolationError = Type.Object({
  type: Type.Literal(JourneyUpsertValidationErrorType.ConstraintViolation),
  violations: Type.Array(JourneyConstraintViolation),
});

export type JourneyUpsertValidationConstraintViolationError = Static<
  typeof JourneyUpsertValidationConstraintViolationError
>;

export const JourneyUpsertIdError = Type.Object({
  type: Type.Literal(JourneyUpsertValidationErrorType.IdError),
  message: Type.String(),
});

export type JourneyUpsertIdError = Static<typeof JourneyUpsertIdError>;

export const JourneyUpsertUniqueConstraintViolationError = Type.Object({
  type: Type.Literal(
    JourneyUpsertValidationErrorType.UniqueConstraintViolation,
  ),
  message: Type.String(),
});

export type JourneyUpsertUniqueConstraintViolationError = Static<
  typeof JourneyUpsertUniqueConstraintViolationError
>;

export const JourneyUpsertStatusTransitionError = Type.Object({
  type: Type.Literal(JourneyUpsertValidationErrorType.StatusTransitionError),
  message: Type.String(),
});

export type JourneyUpsertStatusTransitionError = Static<
  typeof JourneyUpsertStatusTransitionError
>;

export const JourneyUpsertValidationError = Type.Union([
  JourneyUpsertValidationConstraintViolationError,
  JourneyUpsertIdError,
  JourneyUpsertStatusTransitionError,
  JourneyUpsertUniqueConstraintViolationError,
  JourneyUpsertBadValuesError,
]);

export type JourneyUpsertValidationError = Static<
  typeof JourneyUpsertValidationError
>;

export type MessageTags = Record<string, string> & { messageId: string };

export const RelatedResourceProperties = Type.Intersect([
  Type.Record(Type.String(), Type.Unknown()),
  Type.Object({
    journeyId: Type.Optional(Type.String()),
    nodeId: Type.Optional(Type.String()),
    templateId: Type.Optional(Type.String()),
  }),
]);

export type RelatedResourceProperties = Static<
  typeof RelatedResourceProperties
>;

export const FeatureNamesEnum = {
  DisplayJourneyPercentages: "DisplayJourneyPercentages",
  WhiteLabel: "WhiteLabel",
  ComputePropertiesGlobal: "ComputePropertiesGlobal",
} as const;

export const FeatureName = Type.KeyOf(Type.Const(FeatureNamesEnum));

export type FeatureName = Static<typeof FeatureName>;

export type FeatureMap = {
  [K in FeatureName]?: object | boolean;
};

export const WhiteLabelFeatureConfig = Type.Object({
  type: Type.Literal(FeatureNamesEnum.WhiteLabel),
  favicon: Type.Optional(Type.String()),
  title: Type.Optional(Type.String()),
  navCardTitle: Type.Optional(Type.String()),
  navCardDescription: Type.Optional(Type.String()),
  navCardIcon: Type.Optional(Type.String()),
});

export type WhiteLabelFeatureConfig = Static<typeof WhiteLabelFeatureConfig>;

export const ComputePropertiesGlobalFeatureConfig = Type.Object({
  type: Type.Literal(FeatureNamesEnum.ComputePropertiesGlobal),
  targetIntervalMs: Type.Optional(Type.Number()),
});

export type ComputePropertiesGlobalFeatureConfig = Static<
  typeof ComputePropertiesGlobalFeatureConfig
>;

export const DisplayJourneyPercentagesFeatureConfig = Type.Object({
  type: Type.Literal(FeatureNamesEnum.DisplayJourneyPercentages),
});

export type DisplayJourneyPercentagesFeatureConfig = Static<
  typeof DisplayJourneyPercentagesFeatureConfig
>;

export const FeatureConfig = Type.Union([
  WhiteLabelFeatureConfig,
  ComputePropertiesGlobalFeatureConfig,
  DisplayJourneyPercentagesFeatureConfig,
]);

export type FeatureConfig = Static<typeof FeatureConfig>;

export const Features = Type.Array(FeatureConfig);

export type Features = Static<typeof Features>;

export const FeatureConfigByType = {
  [FeatureNamesEnum.ComputePropertiesGlobal]:
    ComputePropertiesGlobalFeatureConfig,
  [FeatureNamesEnum.WhiteLabel]: WhiteLabelFeatureConfig,
  [FeatureNamesEnum.DisplayJourneyPercentages]:
    DisplayJourneyPercentagesFeatureConfig,
} as const;

export const ManualSegmentUploadCsvHeaders = Type.Object({
  [WORKSPACE_ID_HEADER]: WorkspaceId,
  [SEGMENT_ID_HEADER]: Type.String(),
});

export type ManualSegmentUploadCsvHeaders = Static<
  typeof ManualSegmentUploadCsvHeaders
>;

export const GetUserSubscriptionsRequest = Type.Object({
  workspaceId: Type.String(),
  userId: Type.String(),
});

export type GetUserSubscriptionsRequest = Static<
  typeof GetUserSubscriptionsRequest
>;

export const GetUserSubscriptionsResponse = Type.Object({
  workspaceId: Type.String(),
  userId: Type.String(),
  subscriptionGroups: Type.Array(UserSubscriptionResource),
});

export type GetUserSubscriptionsResponse = Static<
  typeof GetUserSubscriptionsResponse
>;

export enum CreateWorkspaceErrorType {
  WorkspaceAlreadyExists = "WorkspaceAlreadyExists",
  WorkspaceNameViolation = "WorkspaceNameViolation",
  InvalidDomain = "InvalidDomain",
}

export const CreateWorkspaceAlreadyExistsError = Type.Object({
  type: Type.Literal(CreateWorkspaceErrorType.WorkspaceAlreadyExists),
});

export type CreateWorkspaceAlreadyExistsError = Static<
  typeof CreateWorkspaceAlreadyExistsError
>;

export const CreateWorkspaceNameViolationError = Type.Object({
  type: Type.Literal(CreateWorkspaceErrorType.WorkspaceNameViolation),
  message: Type.String(),
});

export type CreateWorkspaceNameViolationError = Static<
  typeof CreateWorkspaceNameViolationError
>;

export const CreateWorkspaceInvalidDomainError = Type.Object({
  type: Type.Literal(CreateWorkspaceErrorType.InvalidDomain),
});

export type CreateWorkspaceInvalidDomainError = Static<
  typeof CreateWorkspaceInvalidDomainError
>;

export const CreateWorkspaceError = Type.Union([
  CreateWorkspaceAlreadyExistsError,
  CreateWorkspaceInvalidDomainError,
  CreateWorkspaceNameViolationError,
]);

export type CreateWorkspaceError = Static<typeof CreateWorkspaceError>;

export const WorkspaceTypeAppEnum = {
  Root: "Root",
  Child: "Child",
  Parent: "Parent",
} as const;

export const WorkspaceTypeApp = Type.KeyOf(Type.Const(WorkspaceTypeAppEnum));

export type WorkspaceTypeApp = Static<typeof WorkspaceTypeApp>;

export const WorkspaceResourceExtended = Type.Composite([
  WorkspaceResource,
  Type.Object({
    externalId: Type.Optional(Type.String()),
    type: WorkspaceTypeApp,
    writeKey: Type.String(),
    domain: Type.Optional(Type.String()),
    status: WorkspaceStatusDb,
  }),
]);

export type WorkspaceResourceExtended = Static<
  typeof WorkspaceResourceExtended
>;

export type CreateWorkspaceResult = Result<
  WorkspaceResourceExtended,
  CreateWorkspaceError
>;

export const CreateWorkspaceResultJson = JsonResult(
  WorkspaceResourceExtended,
  CreateWorkspaceError,
);

export type CreateWorkspaceResultJson = Static<
  typeof CreateWorkspaceResultJson
>;

export const ExecuteBroadcastRequest = Type.Object({
  workspaceId: Type.String(),
  broadcastName: Type.String(),
  segmentDefinition: SegmentDefinition,
  messageTemplateDefinition: MessageTemplateResourceDefinition,
  subscriptionGroupId: Type.Optional(Type.String()),
});

export type ExecuteBroadcastRequest = Static<typeof ExecuteBroadcastRequest>;

export const ExecuteBroadcastResponse = Type.Object({
  broadcastName: Type.String(),
  broadcastId: Type.String(),
});

export type ExecuteBroadcastResponse = Static<typeof ExecuteBroadcastResponse>;

export const UserWorkflowTrackEvent = Type.Pick(KnownTrackData, [
  "event",
  "properties",
  "timestamp",
  "context",
  "messageId",
]);

export type UserWorkflowTrackEvent = Static<typeof UserWorkflowTrackEvent>;

export const KeyedSegmentEventContext = Type.Object({
  events: Type.Array(UserWorkflowTrackEvent),
  keyValue: Type.String(),
  definition: KeyedPerformedSegmentNode,
});

export type KeyedSegmentEventContext = Static<typeof KeyedSegmentEventContext>;

export type EmptyObject = Record<never, never>;

export type OptionalAllOrNothing<T, E> = T & (E | EmptyObject);

export type MakeRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export const WorkspaceIdentifier = Type.Union([
  Type.Object({
    workspaceId: Type.String(),
  }),
  Type.Object({
    externalId: Type.String(),
  }),
]);

export type WorkspaceIdentifier = Static<typeof WorkspaceIdentifier>;

export const UpsertEmailProviderRequest = Type.Object({
  workspaceId: Type.String(),
  setDefault: Type.Optional(Type.Boolean()),
  config: WorkspaceWideEmailProviderSecret,
});

export type UpsertEmailProviderRequest = Static<
  typeof UpsertEmailProviderRequest
>;

export const UpsertSmsProviderRequest = Type.Object({
  workspaceId: Type.String(),
  setDefault: Type.Optional(Type.Boolean()),
  config: SmsProviderSecret,
});

export type UpsertSmsProviderRequest = Static<typeof UpsertSmsProviderRequest>;

export const TombstoneWorkspaceRequest = WorkspaceIdentifier;

export type TombstoneWorkspaceRequest = Static<
  typeof TombstoneWorkspaceRequest
>;

export const BaseDeliveryBodyRequest = {
  workspaceId: Type.String(),
  userId: Type.String(),
  journeyId: Type.Optional(Type.Null()),
  templateId: Type.Optional(Type.Null()),
  triggeringMessageId: Type.Optional(Type.Null()),
  messageId: Type.Optional(Type.Null()),
};

export const JourneyTemplateDeliveryBodyRequest = Type.Object({
  ...BaseDeliveryBodyRequest,
  journeyId: Type.String(),
  templateId: Type.String(),
});

export type JourneyTemplateDeliveryBodyRequest = Static<
  typeof JourneyTemplateDeliveryBodyRequest
>;

export const TriggeringMessageDeliveryBodyRequest = Type.Object({
  ...BaseDeliveryBodyRequest,
  triggeringMessageId: Type.String(),
  templateId: Type.Optional(Type.String()),
});

export type TriggeringMessageDeliveryBodyRequest = Static<
  typeof TriggeringMessageDeliveryBodyRequest
>;

export const MessageIdDeliveryBodyRequest = Type.Object({
  ...BaseDeliveryBodyRequest,
  messageId: Type.String(),
});

export type MessageIdDeliveryBodyRequest = Static<
  typeof MessageIdDeliveryBodyRequest
>;

export const GetDeliveryBodyRequest = Type.Union([
  JourneyTemplateDeliveryBodyRequest,
  TriggeringMessageDeliveryBodyRequest,
  MessageIdDeliveryBodyRequest,
]);

export type GetDeliveryBodyRequest = Static<typeof GetDeliveryBodyRequest>;

export const TwilioWebhookRequest = Type.Object({
  workspaceId: Type.String(),
  userId: Type.String(),
  subscriptionGroupId: Type.Optional(Type.String()),
  messageId: Type.Optional(Type.String()),
  journeyId: Type.Optional(Type.String()),
  templateId: Type.Optional(Type.String()),
  nodeId: Type.Optional(Type.String()),
  runId: Type.Optional(Type.String()),
});

export type TwilioWebhookRequest = Static<typeof TwilioWebhookRequest>;

export enum UpsertUserPropertyErrorType {
  UserPropertyAlreadyExists = "UserPropertyAlreadyExists",
  ProtectedUserProperty = "ProtectedUserProperty",
  IdError = "IdError",
}

export const UpsertUserPropertyAlreadyExistsError = Type.Object({
  type: Type.Literal(UpsertUserPropertyErrorType.UserPropertyAlreadyExists),
  message: Type.String(),
});

export type UpsertUserPropertyAlreadyExistsError = Static<
  typeof UpsertUserPropertyAlreadyExistsError
>;

export const UpsertUserPropertyProtectedError = Type.Object({
  type: Type.Literal(UpsertUserPropertyErrorType.ProtectedUserProperty),
  message: Type.String(),
});

export type UpsertUserPropertyProtectedError = Static<
  typeof UpsertUserPropertyProtectedError
>;

export const UpsertUserPropertyIdError = Type.Object({
  type: Type.Literal(UpsertUserPropertyErrorType.IdError),
  message: Type.String(),
});

export type UpsertUserPropertyIdError = Static<
  typeof UpsertUserPropertyIdError
>;

export const UpsertUserPropertyError = Type.Union([
  UpsertUserPropertyAlreadyExistsError,
  UpsertUserPropertyProtectedError,
  UpsertUserPropertyIdError,
]);

export type UpsertUserPropertyError = Static<typeof UpsertUserPropertyError>;

export const ComponentConfigurationEnum = {
  DeliveriesTable: "DeliveriesTable",
  Broadcast: "Broadcast",
  MessageTemplate: "MessageTemplate",
} as const;

export const DeliveriesAllowedColumnEnum = {
  preview: "preview",
  from: "from",
  to: "to",
  userId: "userId",
  snippet: "snippet",
  channel: "channel",
  status: "status",
  origin: "origin",
  sentAt: "sentAt",
  template: "template",
  updatedAt: "updatedAt",
} as const;

export const DeliveriesAllowedColumn = Type.KeyOf(
  Type.Const(DeliveriesAllowedColumnEnum),
);

export const SearchDeliveriesRequestSortByEnum = {
  from: DeliveriesAllowedColumnEnum.from,
  to: DeliveriesAllowedColumnEnum.to,
  status: DeliveriesAllowedColumnEnum.status,
  sentAt: DeliveriesAllowedColumnEnum.sentAt,
} as const;

export const SearchDeliveriesRequestSortBy = Type.KeyOf(
  Type.Const(SearchDeliveriesRequestSortByEnum),
);

export type SearchDeliveriesRequestSortBy = Static<
  typeof SearchDeliveriesRequestSortBy
>;

export type DeliveriesAllowedColumn = Static<typeof DeliveriesAllowedColumn>;

export const DeliveriesTableConfiguration = Type.Object({
  type: Type.Literal(ComponentConfigurationEnum.DeliveriesTable),
  columnAllowList: Type.Optional(Type.Array(DeliveriesAllowedColumn)),
  userUriTemplate: Type.Optional(Type.String()),
  templateUriTemplate: Type.Optional(Type.String()),
  originUriTemplate: Type.Optional(Type.String()),
});

export type DeliveriesTableConfiguration = Static<
  typeof DeliveriesTableConfiguration
>;

export const BroadcastStepKeys = {
  RECIPIENTS: "RECIPIENTS",
  CONTENT: "CONTENT",
  CONFIGURATION: "CONFIGURATION",
  DELIVERIES: "DELIVERIES",
  EVENTS: "EVENTS",
} as const;

export const BroadcastStepKey = Type.KeyOf(Type.Const(BroadcastStepKeys));

export type BroadcastStepKey = Static<typeof BroadcastStepKey>;

export const LowCodeEmailDefaultTypeEnum = {
  Informative: "Informative",
  Empty: "Empty",
} as const;

export const LowCodeEmailDefaultType = Type.KeyOf(
  Type.Const(LowCodeEmailDefaultTypeEnum),
);

export type LowCodeEmailDefaultType = Static<typeof LowCodeEmailDefaultType>;

export const BroadcastConfiguration = Type.Object({
  type: Type.Literal(ComponentConfigurationEnum.Broadcast),
  stepsAllowList: Type.Optional(Type.Array(BroadcastStepKey)),
  emailProviderOverrideAllowList: Type.Optional(
    Type.Array(EmailProviderTypeSchema),
  ),
  hideOverrideSelect: Type.Optional(Type.Boolean()),
  hideScheduledSelect: Type.Optional(Type.Boolean()),
  hideRateLimit: Type.Optional(Type.Boolean()),
  hideDrawer: Type.Optional(Type.Boolean()),
  hideTemplateUserPropertiesPanel: Type.Optional(Type.Boolean()),
  showErrorHandling: Type.Optional(Type.Boolean()),
  allowedEmailContentsTypes: Type.Optional(Type.Array(EmailContentsTypeEnum)),
  lowCodeEmailDefaultType: Type.Optional(LowCodeEmailDefaultType),
});

export type BroadcastConfiguration = Static<typeof BroadcastConfiguration>;

export const MessageTemplateConfiguration = Type.Object({
  type: Type.Literal(ComponentConfigurationEnum.MessageTemplate),
  allowedEmailContentsTypes: Type.Optional(Type.Array(EmailContentsTypeEnum)),
  lowCodeEmailDefaultType: Type.Optional(LowCodeEmailDefaultType),
});

export type MessageTemplateConfiguration = Static<
  typeof MessageTemplateConfiguration
>;

export const ComponentConfigurationDefinition = Type.Union([
  DeliveriesTableConfiguration,
  BroadcastConfiguration,
  MessageTemplateConfiguration,
]);

export type ComponentConfigurationDefinition = Static<
  typeof ComponentConfigurationDefinition
>;

export const ComponentConfigurationResource = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  definition: ComponentConfigurationDefinition,
});

export type ComponentConfigurationResource = Static<
  typeof ComponentConfigurationResource
>;

export const UpsertComponentConfigurationRequest = Type.Object({
  workspaceId: Type.String(),
  name: Type.String(),
  id: Type.Optional(Type.String()),
  definition: Type.Optional(ComponentConfigurationDefinition),
});

export type UpsertComponentConfigurationRequest = Static<
  typeof UpsertComponentConfigurationRequest
>;

export enum UpsertComponentConfigurationValidationErrorType {
  UniqueConstraintViolation = "UniqueConstraintViolation",
  NotFound = "NotFound",
}

export const UpsertComponentConfigurationUniqueConstraintViolationError =
  Type.Object({
    type: Type.Literal(
      UpsertComponentConfigurationValidationErrorType.UniqueConstraintViolation,
    ),
    message: Type.String(),
  });

export type UpsertComponentConfigurationUniqueConstraintViolationError = Static<
  typeof UpsertComponentConfigurationUniqueConstraintViolationError
>;

export const UpsertComponentConfigurationNotFoundError = Type.Object({
  type: Type.Literal(UpsertComponentConfigurationValidationErrorType.NotFound),
  message: Type.String(),
});

export type UpsertComponentConfigurationNotFoundError = Static<
  typeof UpsertComponentConfigurationNotFoundError
>;

export const UpsertComponentConfigurationValidationError = Type.Union([
  UpsertComponentConfigurationUniqueConstraintViolationError,
  UpsertComponentConfigurationNotFoundError,
]);

export type UpsertComponentConfigurationValidationError = Static<
  typeof UpsertComponentConfigurationValidationError
>;

export const DeleteComponentConfigurationRequest = Type.Object({
  workspaceId: Type.String(),
  id: Type.String(),
});

export type DeleteComponentConfigurationRequest = Static<
  typeof DeleteComponentConfigurationRequest
>;

export const GetComponentConfigurationsRequest = Type.Object({
  workspaceId: Type.String(),
});

export type GetComponentConfigurationsRequest = Static<
  typeof GetComponentConfigurationsRequest
>;

export const GetComponentConfigurationsResponse = Type.Object({
  componentConfigurations: Type.Array(ComponentConfigurationResource),
});

export type GetComponentConfigurationsResponse = Static<
  typeof GetComponentConfigurationsResponse
>;

export const UpsertSubscriptionGroupAssignmentsRequest = Type.Object({
  workspaceId: Type.String(),
  userUpdates: Type.Array(
    Type.Object({
      userId: Type.String(),
      changes: Type.Record(Type.String(), Type.Boolean(), {
        description:
          "A map from subscription group ids to a boolean indicating whether the user is subscribed to the subscription group.",
      }),
    }),
  ),
});

export type UpsertSubscriptionGroupAssignmentsRequest = Static<
  typeof UpsertSubscriptionGroupAssignmentsRequest
>;

export const UserGroupAssignmentProperties = Type.Object({
  groupId: Type.String(),
  assigned: Type.Boolean(),
});

export type UserGroupAssignmentProperties = Static<
  typeof UserGroupAssignmentProperties
>;

export const GroupUserAssignmentProperties = Type.Object({
  userId: Type.String(),
  assigned: Type.Boolean(),
});

export type GroupUserAssignmentProperties = Static<
  typeof GroupUserAssignmentProperties
>;

export const GetUsersForGroupRequest = Type.Object({
  workspaceId: Type.String(),
  groupId: Type.String(),
  limit: Type.Optional(Type.Number()),
  offset: Type.Optional(Type.Number()),
});

export type GetUsersForGroupRequest = Static<typeof GetUsersForGroupRequest>;

export const GetUsersForGroupResponse = Type.Object({
  users: Type.Array(Type.String()),
});

export type GetUsersForGroupResponse = Static<typeof GetUsersForGroupResponse>;

export const GetGroupsForUserRequest = Type.Object({
  workspaceId: Type.String(),
  userId: Type.String(),
  limit: Type.Optional(Type.Number()),
  offset: Type.Optional(Type.Number()),
});

export type GetGroupsForUserRequest = Static<typeof GetGroupsForUserRequest>;

export const GetGroupsForUserResponse = Type.Object({
  groups: Type.Array(Type.String()),
});

export type GetGroupsForUserResponse = Static<typeof GetGroupsForUserResponse>;

export const GetJourneysResourcesConfig = Type.Object({
  segments: Type.Optional(Type.Boolean()),
  messageTemplates: Type.Optional(Type.Boolean()),
});

export type GetJourneysResourcesConfig = Static<
  typeof GetJourneysResourcesConfig
>;

export const GetResourcesRequest = Type.Object({
  workspaceId: Type.String(),
  segments: Type.Optional(Type.Boolean()),
  userProperties: Type.Optional(Type.Boolean()),
  subscriptionGroups: Type.Optional(Type.Boolean()),
  broadcasts: Type.Optional(Type.Boolean()),
  journeys: Type.Optional(
    Type.Union([Type.Boolean(), GetJourneysResourcesConfig]),
  ),
  messageTemplates: Type.Optional(Type.Boolean()),
});

export type GetResourcesRequest = Static<typeof GetResourcesRequest>;

export const MinimalJourneysResource = Type.Object({
  id: Type.String(),
  name: Type.String(),
  segments: Type.Optional(Type.Array(Type.String())),
  messageTemplates: Type.Optional(Type.Array(Type.String())),
});

export type MinimalJourneysResource = Static<typeof MinimalJourneysResource>;

export const MinimalBroadcastsResource = Type.Object({
  id: Type.String(),
  name: Type.String(),
  version: Type.Optional(BroadcastResourceVersion),
});

export type MinimalBroadcastsResource = Static<
  typeof MinimalBroadcastsResource
>;

export const GetResourcesResponse = Type.Object({
  segments: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
      }),
    ),
  ),
  userProperties: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
      }),
    ),
  ),
  subscriptionGroups: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
        channel: Type.Enum(ChannelType),
      }),
    ),
  ),
  journeys: Type.Optional(Type.Array(MinimalJourneysResource)),
  messageTemplates: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
      }),
    ),
  ),
  broadcasts: Type.Optional(Type.Array(MinimalBroadcastsResource)),
});

export type GetResourcesResponse = Static<typeof GetResourcesResponse>;

export const ListDataSourceConfigurationRequest = Type.Object({
  workspaceId: Type.String(),
});

export type ListDataSourceConfigurationRequest = Static<
  typeof ListDataSourceConfigurationRequest
>;

export const ListDataSourceConfigurationResponse = Type.Object({
  dataSourceConfigurations: Type.Array(Type.Enum(DataSourceVariantType)),
});

export type ListDataSourceConfigurationResponse = Static<
  typeof ListDataSourceConfigurationResponse
>;

export const DeleteDataSourceConfigurationRequest = Type.Object({
  workspaceId: Type.String(),
  type: Type.Enum(DataSourceVariantType),
});

export type DeleteDataSourceConfigurationRequest = Static<
  typeof DeleteDataSourceConfigurationRequest
>;

export const SearchDeliveriesRequest = Type.Object({
  workspaceId: Type.String(),
  fromIdentifier: Type.Optional(Type.String()),
  toIdentifier: Type.Optional(Type.String()),
  journeyId: Type.Optional(Type.String()),
  userId: Type.Optional(Type.Union([UserId, Type.Array(UserId)])),
  channels: Type.Optional(Type.Array(Type.Enum(ChannelType))),
  limit: Type.Optional(Type.Number()),
  cursor: Type.Optional(Type.String()),
  from: Type.Optional(Type.Array(Type.String())),
  to: Type.Optional(Type.Array(Type.String())),
  statuses: Type.Optional(Type.Array(Type.String())),
  templateIds: Type.Optional(Type.Array(Type.String())),
  startDate: Type.Optional(Type.String()),
  endDate: Type.Optional(Type.String()),
  sortBy: Type.Optional(SearchDeliveriesRequestSortBy),
  sortDirection: Type.Optional(SortDirection),
  broadcastId: Type.Optional(Type.String()),
  triggeringProperties: Type.Optional(
    Type.Array(
      Type.Object({
        key: Type.String(),
        value: Type.Union([Type.String(), Type.Number()]),
      }),
    ),
  ),
  groupId: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export type SearchDeliveriesRequest = Static<typeof SearchDeliveriesRequest>;

export const DownloadDeliveriesRequest = Type.Omit(SearchDeliveriesRequest, [
  "limit",
  "cursor",
]);

export type DownloadDeliveriesRequest = Static<
  typeof DownloadDeliveriesRequest
>;

export const BroadcastConfigTypeEnum = {
  V2: "V2",
} as const;

export const BroadcastConfigType = Type.KeyOf(
  Type.Const(BroadcastConfigTypeEnum),
);

export type BroadcastConfigType = Static<typeof BroadcastConfigType>;

export const BroadcastErrorHandlingEnum = {
  PauseOnError: "PauseOnError",
  SkipOnError: "SkipOnError",
} as const;

export const BroadcastErrorHandling = Type.KeyOf(
  Type.Const(BroadcastErrorHandlingEnum),
);

export type BroadcastErrorHandling = Static<typeof BroadcastErrorHandling>;

export const BroadcastEmailMessageVariant = Type.Object({
  type: Type.Literal(ChannelType.Email),
  providerOverride: Type.Optional(Type.Enum(EmailProviderType)),
});

export type BroadcastEmailMessageVariant = Static<
  typeof BroadcastEmailMessageVariant
>;

export const BaseBroadcastSmsMessageVariant = Type.Object({
  type: Type.Literal(ChannelType.Sms),
});

export const BroadcastSmsMessageVariant = Type.Union([
  Type.Composite([BaseBroadcastSmsMessageVariant, NoSmsProviderOverride]),
  Type.Composite([BaseBroadcastSmsMessageVariant, TwilioOverride]),
  Type.Composite([BaseBroadcastSmsMessageVariant, TestSmsOverride]),
]);

export type BroadcastSmsMessageVariant = Static<
  typeof BroadcastSmsMessageVariant
>;
export const BroadcastV2Config = Type.Object({
  type: Type.Literal(BroadcastConfigTypeEnum.V2),
  // messages per second
  rateLimit: Type.Optional(Type.Number()),
  defaultTimezone: Type.Optional(Type.String()),
  useIndividualTimezone: Type.Optional(Type.Boolean()),
  errorHandling: Type.Optional(BroadcastErrorHandling),
  batchSize: Type.Optional(Type.Number()),
  message: Type.Union([
    // Defined separately to allow workspace member specific providers.
    BroadcastEmailMessageVariant,
    BroadcastSmsMessageVariant,
    Type.Omit(WebhookMessageVariant, ["templateId"]),
  ]),
});

export type BroadcastV2Config = Static<typeof BroadcastV2Config>;

export const BroadcastV2StatusEnum = {
  Draft: "Draft",
  Scheduled: "Scheduled",
  Running: "Running",
  Paused: "Paused",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Failed: "Failed",
} as const;

export const BroadcastV2Status = Type.KeyOf(Type.Const(BroadcastV2StatusEnum));

export type BroadcastV2Status = Static<typeof BroadcastV2Status>;

export const BroadcastResourceV2 = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  name: Type.String(),
  segmentId: Type.Optional(Type.String()),
  messageTemplateId: Type.Optional(Type.String()),
  subscriptionGroupId: Type.Optional(Type.String()),
  config: BroadcastV2Config,
  status: BroadcastV2Status,
  scheduledAt: Type.Optional(Type.String()),
  createdAt: Type.Number(),
  updatedAt: Type.Number(),
  archived: Type.Optional(Type.Boolean()),
  version: Type.Literal(BroadcastResourceVersionEnum.V2),
});

export type BroadcastResourceV2 = Static<typeof BroadcastResourceV2>;

export const UpsertBroadcastV2ErrorTypeEnum = {
  IdError: "IdError",
  UniqueConstraintViolation: "UniqueConstraintViolation",
  MissingRequiredFields: "MissingRequiredFields",
  ConstraintViolation: "ConstraintViolation",
} as const;

export const UpsertBroadcastV2ErrorType = Type.KeyOf(
  Type.Const(UpsertBroadcastV2ErrorTypeEnum),
);

export type UpsertBroadcastV2ErrorType = Static<
  typeof UpsertBroadcastV2ErrorType
>;

export const UpsertBroadcastV2Error = Type.Object({
  type: UpsertBroadcastV2ErrorType,
  message: Type.String(),
});

export type UpsertBroadcastV2Error = Static<typeof UpsertBroadcastV2Error>;

export const ComputedPropertyTypeEnum = {
  Segment: "Segment",
  UserProperty: "UserProperty",
} as const;

export const ComputedPropertyType = Type.KeyOf(
  Type.Const(ComputedPropertyTypeEnum),
);

export type ComputedPropertyType = Static<typeof ComputedPropertyType>;

export const ComputedPropertyStepEnum = {
  ComputeState: "ComputeState",
  ComputeAssignments: "ComputeAssignments",
  ProcessAssignments: "ProcessAssignments",
} as const;

export const ComputedPropertyStep = Type.KeyOf(
  Type.Const(ComputedPropertyStepEnum),
);

export type ComputedPropertyStep = Static<typeof ComputedPropertyStep>;

export const GetComputedPropertyPeriodsRequest = Type.Object({
  workspaceId: Type.String(),
  step: ComputedPropertyStep,
});

export type GetComputedPropertyPeriodsRequest = Static<
  typeof GetComputedPropertyPeriodsRequest
>;

export const ComputedPropertyPeriod = Type.Object({
  id: Type.String(),
  workspaceId: Type.String(),
  type: ComputedPropertyType,
  lastRecomputed: Type.String(),
});

export type ComputedPropertyPeriod = Static<typeof ComputedPropertyPeriod>;

export const GetComputedPropertyPeriodsResponse = Type.Object({
  periods: Type.Array(ComputedPropertyPeriod),
});

export type GetComputedPropertyPeriodsResponse = Static<
  typeof GetComputedPropertyPeriodsResponse
>;

export const TriggerRecomputeRequest = Type.Object({
  workspaceId: Type.String(),
});

export type TriggerRecomputeRequest = Static<typeof TriggerRecomputeRequest>;

export const BaseUpsertBroadcastV2Request = Type.Object({
  workspaceId: Type.String(),
  segmentId: NullableAndOptional(Type.String()),
  messageTemplateId: NullableAndOptional(Type.String()),
  subscriptionGroupId: NullableAndOptional(Type.String()),
  config: Type.Optional(BroadcastV2Config),
  scheduledAt: NullableAndOptional(Type.String()),
});

export type BaseUpsertBroadcastV2Request = Static<
  typeof BaseUpsertBroadcastV2Request
>;

export const UpsertBroadcastV2Request = Type.Intersect([
  BaseUpsertBroadcastV2Request,
  IdOrName,
]);

export type UpsertBroadcastV2Request = Static<typeof UpsertBroadcastV2Request>;

export const BroadcastResourceAllVersions = Type.Union([
  BroadcastResourceV2,
  BroadcastResource,
]);

export type BroadcastResourceAllVersions = Static<
  typeof BroadcastResourceAllVersions
>;

export const GetBroadcastsResponse = Type.Array(BroadcastResourceAllVersions);

export type GetBroadcastsResponse = Static<typeof GetBroadcastsResponse>;

export const GetBroadcastsV2Request = Type.Object({
  workspaceId: Type.String(),
  ids: Type.Optional(Type.Array(Type.String())),
});

export type GetBroadcastsV2Request = Static<typeof GetBroadcastsV2Request>;

export const UpdateBroadcastArchiveRequest = Type.Object({
  workspaceId: Type.String(),
  broadcastId: Type.String(),
  archived: Type.Optional(Type.Boolean()),
});

export type UpdateBroadcastArchiveRequest = Static<
  typeof UpdateBroadcastArchiveRequest
>;

export const RecomputeBroadcastSegmentRequest = Type.Object({
  workspaceId: Type.String(),
  broadcastId: Type.String(),
});

export type RecomputeBroadcastSegmentRequest = Static<
  typeof RecomputeBroadcastSegmentRequest
>;

export const StartBroadcastRequest = Type.Object({
  workspaceId: Type.String(),
  broadcastId: Type.String(),
});

export type StartBroadcastRequest = Static<typeof StartBroadcastRequest>;

export const PauseBroadcastRequest = Type.Object({
  workspaceId: Type.String(),
  broadcastId: Type.String(),
});

export type PauseBroadcastRequest = Static<typeof PauseBroadcastRequest>;

export const ResumeBroadcastRequest = Type.Object({
  workspaceId: Type.String(),
  broadcastId: Type.String(),
});

export type ResumeBroadcastRequest = Static<typeof ResumeBroadcastRequest>;

export const CancelBroadcastRequest = Type.Object({
  workspaceId: Type.String(),
  broadcastId: Type.String(),
});

export type CancelBroadcastRequest = Static<typeof CancelBroadcastRequest>;

export const UpdateManualSegmentUsersRequest = Type.Composite([
  Type.Object({
    workspaceId: Type.String(),
    segmentId: Type.String(),
    userIds: Type.Array(Type.String()),
    append: Type.Optional(Type.Boolean()),
    sync: Type.Optional(Type.Boolean()),
  }),
]);

export type UpdateManualSegmentUsersRequest = Static<
  typeof UpdateManualSegmentUsersRequest
>;

export const GetManualSegmentStatusRequest = Type.Object({
  workspaceId: Type.String(),
  segmentId: Type.String(),
});

export type GetManualSegmentStatusRequest = Static<
  typeof GetManualSegmentStatusRequest
>;

export const GetManualSegmentStatusResponse = Type.Object({
  lastComputedAt: Nullable(Type.String()),
});

export type GetManualSegmentStatusResponse = Static<
  typeof GetManualSegmentStatusResponse
>;

export const ClearManualSegmentRequest = Type.Object({
  workspaceId: Type.String(),
  segmentId: Type.String(),
});

export type ClearManualSegmentRequest = Static<
  typeof ClearManualSegmentRequest
>;

export const ManualSegmentUpdateEventProperties = Type.Object({
  segmentId: Type.String(),
  version: Type.Number(),
  // represent a boolean value as a number 0 or 1
  inSegment: Type.Number(),
});

export type ManualSegmentUpdateEventProperties = Static<
  typeof ManualSegmentUpdateEventProperties
>;

export const GetGmailAuthorizationRequest = Type.Object({
  workspaceId: Type.String(),
});

export type GetGmailAuthorizationRequest = Static<
  typeof GetGmailAuthorizationRequest
>;

export const GetGmailAuthorizationResponse = Type.Object({
  authorized: Type.Boolean(),
});

export type GetGmailAuthorizationResponse = Static<
  typeof GetGmailAuthorizationResponse
>;

export interface EmbeddedSession {
  workspaceId: string;
  occupantId?: string;
}

export const OauthFlowEnum = {
  PopUp: "PopUp",
  Redirect: "Redirect",
} as const;

export const OauthFlow = Type.KeyOf(Type.Const(OauthFlowEnum));
export type OauthFlow = Static<typeof OauthFlow>;

export const SetCsrfCookieRequest = Type.Object({
  workspaceId: Type.String(),
  csrfToken: Type.String(),
  expiresAt: Type.String({ format: "date-time" }), // Expect ISO date string
});

export type SetCsrfCookieRequest = Static<typeof SetCsrfCookieRequest>;

export interface UserEventV2 {
  event_type: string;
  event: string;
  event_time: string;
  message_id: string;
  user_id: string;
  anonymous_id: string;
  user_or_anonymous_id: string;
  properties: string;
  processing_time: string;
  message_raw: string;
  workspace_id: string;
}
