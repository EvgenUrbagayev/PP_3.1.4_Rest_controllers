const url ='http://localhost:8080/api/user'

fetch("/api/user")
    .then(res => res.json())
    .then(user => {
        let tableRow = document.createElement("tr");
        let roles = "";

        user.roles.forEach(role => {
            if (typeof role === "string") {
                roles += role.replace("ROLE_", "") + " ";
            } else if (role.role) {
                roles += role.role.replace("ROLE_", "") + " ";
            }
        });

        tableRow.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.surname}</td>
      <td>${user.age}</td>
      <td>${roles.trim()}</td>
    `;
        document.getElementById("userInfo").append(tableRow);
    });
