fetch("/api/user")
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(user => {
        console.log("User data received:", user); // Отладочное сообщение

        let tableRow = document.createElement("tr");
        let roles = "";

        // Проверяем, есть ли вообще roles у пользователя
        if (!user.roles || !Array.isArray(user.roles)) {
            console.error("No roles array in user object");
            roles = "No roles";
        } else {
            // Обрабатываем роли
            user.roles.forEach(role => {
                // Проверяем разные возможные форматы роли
                if (typeof role === "string") {
                    roles += role.replace("ROLE_", "") + ", ";
                } else if (role.role) {
                    roles += role.role.replace("ROLE_", "") + ", ";
                } else if (role.authority) {
                    roles += role.authority.replace("ROLE_", "") + ", ";
                }
            });

            // Удаляем последнюю запятую и пробел
            roles = roles.replace(/, $/, "");
        }

        tableRow.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name || 'N/A'}</td>
            <td>${user.surname || 'N/A'}</td>
            <td>${user.age || 'N/A'}</td>
            <td>${roles}</td>
        `;
        document.getElementById("userInfo").append(tableRow);
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
        // Можно добавить отображение ошибки на странице
        document.getElementById("userInfo").innerHTML = `
            <tr>
                <td colspan="5" class="text-danger">Error loading user data: ${error.message}</td>
            </tr>
        `;
    });