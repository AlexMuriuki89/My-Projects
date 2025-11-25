const API_URL = 'http://localhost:3000';

// Fetch functions
async function fetchDepartments() {
  try {
    const response = await fetch(`${API_URL}/departments`);
    if (!response.ok) throw new Error('Failed to fetch departments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

async function createDepartment(departmentData) {
  try {
    const response = await fetch(`${API_URL}/departments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(departmentData),
    });
    if (!response.ok) throw new Error('Failed to create department');
    return await response.json();
  } catch (error) {
    console.error('Error creating department:', error);
    alert('Failed to create department!');
    return null;
  }
}

async function updateDepartment(id, departmentData) {
  try {
    const response = await fetch(`${API_URL}/departments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(departmentData),
    });
    if (!response.ok) throw new Error('Failed to update department');
    return await response.json();
  } catch (error) {
    console.error('Error updating department:', error);
    return null;
  }
}

async function deleteDepartment(id) {
  try {
    const response = await fetch(`${API_URL}/departments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete department');
    return true;
  } catch (error) {
    console.error('Error deleting department:', error);
    return false;
  }
}

async function fetchTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

async function createTask(taskData) {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    alert('Failed to create task!');
    return null;
  }
}

async function updateTask(id, taskData) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Failed to update task!');
    return null;
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

// Main function to load and populate data
async function loadDataFromBackend() {
  console.log('Attempting to load data from backend...');

  const departments = await fetchDepartments();
  const tasks = await fetchTasks();

  console.log('Departments from backend:', departments);
  console.log('Tasks from backend:', tasks);

  // If backend returns data, use it. Otherwise, use the built-in data
  if (departments.length > 0) {
    console.log('✅ Backend data loaded successfully');
    await populateDepartmentsFromBackend(departments, tasks);

    // Re-setup event listeners after populating from backend
    if (typeof setupEventListeners === 'function') {
      setupEventListeners();
    }

    // Load the first department
    if (
      typeof loadDepartmentContent === 'function' &&
      typeof currentDepartment !== 'undefined'
    ) {
      loadDepartmentContent(currentDepartment);
    }
  } else {
    console.log('⚠️ Backend not available. Using built-in frontend data.');
    // The HTML already has the departments and data, so we don't need to do anything
    // The init() function will handle everything
  }

  return { departments, tasks };
}

// Transform backend data to match the frontend structure
async function populateDepartmentsFromBackend(departments, tasks) {
  // Get references to DOM elements
  const departmentList = document.getElementById('departmentList');

  if (!departmentList) {
    console.error('Department list element not found');
    return;
  }

  // Clear the sidebar
  departmentList.innerHTML = '';

  // Clear existing departmentData (if it exists)
  if (typeof departmentData !== 'undefined') {
    for (let key in departmentData) {
      delete departmentData[key];
    }

    // Populate with backend data
    departments.forEach((dept, index) => {
      const deptId = dept.id;

      // Filter tasks for this department
      const deptTasks = tasks
        .filter((task) => task.departmentId === deptId)
        .map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          status: mapStatusFromBackend(task.status),
          category: mapCategoryFromBackend(task.priority),
          deadline: task.dueDate || new Date().toISOString(),
          priority: task.priority || 'medium',
        }));

      // Add to departmentData
      departmentData[deptId] = {
        title: dept.name,
        icon: dept.name.substring(0, 2).toUpperCase(),
        description: dept.description || 'Department tasks and projects',
        tasks: deptTasks,
      };

      // Add to sidebar
      const isActive = index === 0 ? 'active' : '';
      const departmentHTML = `
        <div class="department-item ${isActive}" data-dept="${deptId}">
          <div class="department-icon">${dept.name.substring(0, 2).toUpperCase()}</div>
          <div class="department-info">
            <div class="department-name">${dept.name}</div>
            <div class="department-count">${deptTasks.length} active tasks</div>
          </div>
        </div>
      `;
      departmentList.insertAdjacentHTML('beforeend', departmentHTML);
    });

    // Set first department as current
    if (
      Object.keys(departmentData).length > 0 &&
      typeof currentDepartment !== 'undefined'
    ) {
      currentDepartment = Object.keys(departmentData)[0];
    }
  }
}

// Helper functions to map backend values to frontend values
function mapStatusFromBackend(backendStatus) {
  const statusMap = {
    pending: 'pending',
    'in-progress': 'ongoing',
    in_progress: 'ongoing',
    completed: 'completed',
    done: 'completed',
  };
  return statusMap[backendStatus?.toLowerCase()] || 'pending';
}

function mapCategoryFromBackend(priority) {
  const categoryMap = {
    high: 'critical',
    urgent: 'critical',
    medium: 'open-float',
    low: 'merchant-credit',
    normal: 'pfms',
  };
  return categoryMap[priority?.toLowerCase()] || 'open-float';
}

function mapStatusToBackend(frontendStatus) {
  const statusMap = {
    pending: 'pending',
    ongoing: 'in-progress',
    completed: 'completed',
  };
  return statusMap[frontendStatus] || 'pending';
}
