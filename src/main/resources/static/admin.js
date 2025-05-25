document.addEventListener('DOMContentLoaded', () => {
    // API endpoints
    const API = {
        USERS: '/api/admin-list/users',
        ROLES: '/api/admin-list/roles'
    };

    // DOM elements
    const DOM = {
        tableBody: document.getElementById('tableAllUsers'),
        newUserForm: document.getElementById('newUserForm'),
        editUserForm: document.getElementById('editUserForm'),
        deleteUserForm: document.getElementById('deleteUserForm'),
        rolesSelect: document.getElementById('roles'),
        rolesEditSelect: document.getElementById('rolesEdit')
    };

    // Load all data on startup
    init();

    async function init() {
        await loadUsers();
        await loadRoles();
        setupEventListeners();
    }

    // ========== DATA LOADING ==========

    async function loadUsers() {
        try {
            const response = await fetch(API.USERS);
            if (!response.ok) throw new Error('Failed to load users');

            const users = await response.json();
            renderUsersTable(users);
        } catch (error) {
            console.error('Error loading users:', error);
            alert('Failed to load users. Please try again.');
        }
    }

    async function loadRoles() {
        try {
            const response = await fetch(API.ROLES);
            if (!response.ok) throw new Error('Failed to load roles');

            const rolesData = await response.json();
            // Assuming rolesData is List<List<Role>> - take first element
            const roles = Array.isArray(rolesData) ? rolesData[0] : [];
            renderRolesSelect(roles, DOM.rolesSelect);
            renderRolesSelect(roles, DOM.rolesEditSelect);
        } catch (error) {
            console.error('Error loading roles:', error);
            alert('Failed to load roles. Please try again.');
        }
    }

    // ========== RENDERING ==========

    function renderUsersTable(users) {
        DOM.tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username || user.name}</td>
                <td>${user.surname || '-'}</td>
                <td>${user.age}</td>
                <td>${formatRoles(user.roles)}</td>
                <td>
                    <button class="btn btn-info btn-sm" data-id="${user.id}" data-action="edit">
                        Edit
                    </button>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" data-id="${user.id}" data-action="delete">
                        Delete
                    </button>
                </td>
            `;
            DOM.tableBody.appendChild(row);
        });
    }

    function renderRolesSelect(roles, selectElement) {
        if (!selectElement) return;

        selectElement.innerHTML = '';

        // Add default empty option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select role';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        // Add role options
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = formatRoleName(role.authority);
            selectElement.appendChild(option);
        });
    }

    function formatRoles(roles) {
        return Array.isArray(roles)
            ? roles.map(r => formatRoleName(r.authority)).join(', ')
            : '';
    }

    function formatRoleName(roleName) {
        return roleName ? roleName.replace(/^ROLE_/, '') : 'UNKNOWN';
    }

    // ========== FORM HANDLING ==========

    function setupEventListeners() {
        // New user form
        DOM.newUserForm?.addEventListener('submit', handleCreateUser);

        // Edit user form
        DOM.editUserForm?.addEventListener('submit', handleUpdateUser);

        // Delete user form
        DOM.deleteUserForm?.addEventListener('submit', handleDeleteUser);

        // Table action buttons (edit/delete)
        DOM.tableBody?.addEventListener('click', handleTableAction);

        // Modal show events
        $('#editModal').on('show.bs.modal', loadUserForEdit);
    }

    async function handleCreateUser(e) {
        e.preventDefault();

        const formData = new FormData(DOM.newUserForm);

        const user = {
            name: String(formData.get('name')),
            surname: String(formData.get('surname')),
            age: parseInt(formData.get('age')),
            password: String(formData.get('pass')),
            roles: getSelectedRoles(DOM.rolesSelect)
        };

        console.log('Отправляемые данные:', JSON.stringify(user, null, 2));

        try {
            const response = await fetch(API.USERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка сервера');
            }

            await loadUsers();
            DOM.newUserForm.reset();
            alert('Пользователь успешно создан!');
        } catch (error) {
            console.error('Ошибка:', error);
            alert(`Ошибка создания пользователя: ${error.message}`);
        }
    }

    function getSelectedRolesWithAuthority(selectElement) {
        return Array.from(selectElement.selectedOptions)
            .filter(opt => opt.value)
            .map(opt => ({
                id: opt.value,
                authority: opt.textContent || `ROLE_${opt.value}`
            }));
    }

// Измененная функция getSelectedRoles
    function getSelectedRoles(selectElement) {
        return Array.from(selectElement.selectedOptions)
            .filter(opt => opt.value)
            .map(opt => ({
                id: opt.value,
                authority: opt.textContent || `ROLE_${opt.value}` // Добавляем authority
            }));
    }

    async function handleUpdateUser(e) {
        e.preventDefault();

        const formData = new FormData(DOM.editUserForm);
        const userId = formData.get('id');

        try {
            // Загружаем текущие данные пользователя, чтобы не потерять surname
            const userResponse = await fetch(`${API.USERS}/${userId}`);
            if (!userResponse.ok) throw new Error('Ошибка загрузки данных пользователя');
            const userData = await userResponse.json();

            const user = {
                id: userId,
                username: formData.get('username'),
                name: formData.get('username') || userData.name, // Используем текущее имя, если username пуст
                surname: userData.surname, // Берем из существующих данных
                age: formData.get('age'),
                password: formData.get('password'),
                roles: getSelectedRoles(DOM.rolesEditSelect)
            };

            const response = await fetch(`${API.USERS}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка обновления пользователя');
            }

            await loadUsers(); // Обновляем таблицу
            $('#editModal').modal('hide');
            alert('Данные пользователя обновлены!');
        } catch (error) {  // Теперь catch корректно обрабатывается
            console.error('Ошибка:', error);
            alert(`Не удалось обновить пользователя: ${error.message}`);
        }
    }

    async function handleDeleteUser(e) {
        e.preventDefault();

        const userId = document.getElementById('idDelete').value;

        try {
            const response = await fetch(`${API.USERS}/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete user');

            await loadUsers();
            $('#deleteModal').modal('hide');
            alert('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        }
    }

    // ========== UTILITIES ==========

    function getSelectedRoles(selectElement) {
        return Array.from(selectElement.selectedOptions)
            .filter(opt => opt.value)
            .map(opt => ({ id: opt.value }));
    }

    async function loadUserForEdit() {
        const userId = document.querySelector('[data-action="edit"].active')?.dataset.id;
        if (!userId) return;

        try {
            const response = await fetch(`${API.USERS}/${userId}`);
            if (!response.ok) throw new Error('Failed to load user data');

            const user = await response.json();

            // Fill edit form
            document.getElementById('idEdit').value = user.id;
            document.getElementById('usernameEdit').value = user.username || user.name;
            document.getElementById('ageEdit').value = user.age;

            // Select roles
            if (Array.isArray(user.roles)) {
                const rolesSelect = DOM.rolesEditSelect;
                Array.from(rolesSelect.options).forEach(option => {
                    option.selected = user.roles.some(r => r.id == option.value);
                });
            }
        } catch (error) {
            console.error('Error loading user for edit:', error);
            alert('Failed to load user data. Please try again.');
        }
    }

    function handleTableAction(e) {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const userId = button.dataset.id;

        if (action === 'edit') {
            // Mark button as active for edit modal
            document.querySelectorAll('[data-action="edit"]').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            $('#editModal').modal('show');
        } else if (action === 'delete') {
            // Fill delete modal
            const row = button.closest('tr');
            document.getElementById('idDelete').value = userId;
            document.getElementById('usernameDelete').value = row.cells[1].textContent;
            document.getElementById('ageDelete').value = row.cells[2].textContent;

            // Format roles for display
            const rolesSelect = document.getElementById('rolesDelete');
            rolesSelect.innerHTML = '';
            row.cells[3].textContent.split(', ').forEach(role => {
                const option = document.createElement('option');
                option.textContent = role;
                option.selected = true;
                rolesSelect.appendChild(option);
            });

            $('#deleteModal').modal('show');
        }
    }
});


