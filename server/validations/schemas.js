const idPattern = /^[0-9a-fA-F]{24}$/;
const statuses = ['To Do', 'In Progress', 'Review', 'Completed'];
const priorities = ['Low', 'Medium', 'High'];

function issue(field, message) {
  return { path: [field], message };
}

function result(data, issues) {
  return issues.length
    ? { success: false, error: { issues } }
    : { success: true, data };
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function optionalId(value, field, issues) {
  if (!value) return value;
  if (typeof value !== 'string' || !idPattern.test(value)) {
    issues.push(issue(field, 'Invalid id'));
  }
  return value;
}

function validateTask(body, partial = false) {
  const data = { ...body };
  const issues = [];

  if (!partial || data.title !== undefined) {
    data.title = cleanString(data.title);
    if (!data.title) issues.push(issue('title', 'Task title is required'));
  }

  if (data.description !== undefined) data.description = cleanString(data.description);
  if (data.projectId !== undefined) data.projectId = optionalId(data.projectId, 'projectId', issues);
  if (data.assignedTo !== undefined) data.assignedTo = optionalId(data.assignedTo, 'assignedTo', issues);
  if (data.boardColumnId !== undefined) data.boardColumnId = optionalId(data.boardColumnId, 'boardColumnId', issues);
  if (data.status !== undefined && !statuses.includes(data.status)) issues.push(issue('status', 'Invalid task status'));
  if (data.priority !== undefined && !priorities.includes(data.priority)) issues.push(issue('priority', 'Invalid task priority'));
  if (data.position !== undefined && typeof data.position !== 'number') issues.push(issue('position', 'Position must be a number'));
  if (partial && Object.keys(data).length === 0) issues.push(issue('body', 'At least one field is required'));

  return result(data, issues);
}

export const registerSchema = {
  safeParse(body) {
    const data = {
      name: cleanString(body.name),
      email: cleanString(body.email)?.toLowerCase(),
      password: body.password
    };
    const issues = [];
    if (!data.name || data.name.length < 2) issues.push(issue('name', 'Name is required'));
    if (!data.email || !data.email.includes('@')) issues.push(issue('email', 'Valid email is required'));
    if (!data.password || data.password.length < 6) issues.push(issue('password', 'Password must be at least 6 characters'));
    return result(data, issues);
  }
};

export const loginSchema = {
  safeParse(body) {
    const data = {
      email: cleanString(body.email)?.toLowerCase(),
      password: body.password
    };
    const issues = [];
    if (!data.email || !data.email.includes('@')) issues.push(issue('email', 'Valid email is required'));
    if (!data.password) issues.push(issue('password', 'Password is required'));
    return result(data, issues);
  }
};

export const taskSchema = {
  safeParse(body) {
    return validateTask(body);
  }
};

export const updateTaskSchema = {
  safeParse(body) {
    return validateTask(body, true);
  }
};

export const borrowToolSchema = {
  safeParse(body) {
    const data = { ...body };
    const issues = [];
    if (!data.taskId || !idPattern.test(data.taskId)) issues.push(issue('taskId', 'Invalid task id'));
    if (data.status !== undefined && !statuses.includes(data.status)) issues.push(issue('status', 'Invalid task status'));
    if (data.position !== undefined && typeof data.position !== 'number') issues.push(issue('position', 'Position must be a number'));
    if (data.boardColumnId !== undefined) data.boardColumnId = optionalId(data.boardColumnId, 'boardColumnId', issues);
    return result(data, issues);
  }
};

export const paymentSchema = {
  safeParse(body) {
    return result(body, []);
  }
};

export const aiSuggestSchema = {
  safeParse(body) {
    const data = { text: cleanString(body.text) };
    const issues = [];
    if (!data.text || data.text.length < 5) issues.push(issue('text', 'Text must be at least 5 characters'));
    if (data.text && data.text.length > 1000) issues.push(issue('text', 'Text is too long'));
    return result(data, issues);
  }
};
