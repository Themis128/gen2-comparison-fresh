export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        role
        status
        lastLogin
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name
      email
      role
      status
      lastLogin
      createdAt
      updatedAt
    }
  }
`;

export const listSystemMetrics = /* GraphQL */ `
  query ListSystemMetrics(
    $filter: ModelSystemMetricFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSystemMetrics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        metricType
        value
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const createSystemMetric = /* GraphQL */ `
  mutation CreateSystemMetric(
    $input: CreateSystemMetricInput!
    $condition: ModelSystemMetricConditionInput
  ) {
    createSystemMetric(input: $input, condition: $condition) {
      id
      metricType
      value
      timestamp
      createdAt
      updatedAt
    }
  }
`;

export const listActivityLogs = /* GraphQL */ `
  query ListActivityLogs(
    $filter: ModelActivityLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActivityLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        message
        userId
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const createActivityLog = /* GraphQL */ `
  mutation CreateActivityLog(
    $input: CreateActivityLogInput!
    $condition: ModelActivityLogConditionInput
  ) {
    createActivityLog(input: $input, condition: $condition) {
      id
      type
      message
      userId
      timestamp
      createdAt
      updatedAt
    }
  }
`;

export const listAlerts = /* GraphQL */ `
  query ListAlerts(
    $filter: ModelAlertFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlerts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        message
        resolved
        resolvedAt
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const updateAlert = /* GraphQL */ `
  mutation UpdateAlert(
    $input: UpdateAlertInput!
    $condition: ModelAlertConditionInput
  ) {
    updateAlert(input: $input, condition: $condition) {
      id
      type
      message
      resolved
      resolvedAt
      createdAt
      updatedAt
    }
  }
`;
export const listAuditLogs = /* GraphQL */ `
  query ListAuditLogs(
    $filter: ModelAuditLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAuditLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        action
        resource
        resourceId
        userId
        details
        ipAddress
        userAgent
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const createAuditLog = /* GraphQL */ `
  mutation CreateAuditLog(
    $input: CreateAuditLogInput!
    $condition: ModelAuditLogConditionInput
  ) {
    createAuditLog(input: $input, condition: $condition) {
      id
      action
      resource
      resourceId
      userId
      details
      ipAddress
      userAgent
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      email
      role
      status
      lastLogin
      createdAt
      updatedAt
    }
  }
`;

export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      email
      role
      status
      lastLogin
      createdAt
      updatedAt
    }
  }
`;