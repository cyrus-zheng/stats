const getUserStats = async () => {
    try {
        return (await fetch("/api/user-stats")).json();
    } catch (error) {
        console.error(error);
    }
}

const showUserStats = async () => {
    let userStats = await getUserStats();
    let userStatsDiv = document.getElementById("user-stats-list");
    userStatsDiv.classList.add("flex-container");
    userStatsDiv.classList.add("wrap");
    userStatsDiv.innerHTML = "";

    userStats.forEach((userStat) => {
        const section = document.createElement("section");
        section.classList.add("user-stat-model");
        userStatsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = userStat.name + " (Age: " + userStat.age + ")";
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            document.getElementById("hide-details").classList.remove("hidden");
            displayDetails(userStat);
        };

        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        section.append(editButton);

        editButton.onclick = (e) => {
            e.preventDefault();
            document.querySelector(".dialog").classList.remove("transparent");
            document.getElementById("add-edit").innerHTML = "Edit User Stats";
            populateEditForm(userStat);
        };

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        section.append(deleteButton);

        deleteButton.onclick = async (e) => {
            e.preventDefault();
            const confirmation = window.confirm("Are you sure you want to delete this user stat?");
            if (confirmation) {
                await deleteUserStat(userStat);
            }
        };
    });
};

const displayDetails = (userStat) => {
    const userStatDetails = document.getElementById("user-stat-details");
    userStatDetails.innerHTML = "";
    userStatDetails.classList.add("flex-container");

    const h3 = document.createElement("h3");
    h3.innerHTML = userStat.name + " (Age: " + userStat.age + ")";
    userStatDetails.append(h3);
    h3.classList.add("pad-this");

    const p1 = document.createElement("p");
    userStatDetails.append(p1);
    p1.innerHTML = 'Height: ' + userStat.height + ' ft';
    p1.classList.add("pad-this");

    const p2 = document.createElement("p");
    userStatDetails.append(p2);
    p2.innerHTML = 'Weight: ' + userStat.weight + ' lbs';
    p2.classList.add("pad-this");

    const p3 = document.createElement("p");
    userStatDetails.append(p3);
    p3.innerHTML = 'Preferred Position: ' + userStat.preferredPosition;
    p3.classList.add("pad-this");

    const p4 = document.createElement("p");
    userStatDetails.append(p4);
    p4.innerHTML = 'Passing Accuracy: ' + userStat.passingAccuracy;
    p4.classList.add("pad-this");

    const p5 = document.createElement("p");
    userStatDetails.append(p5);
    p5.innerHTML = 'Dribble Success: ' + userStat.dribbleSuccess;
    p5.classList.add("pad-this");

    const p6 = document.createElement("p");
    userStatDetails.append(p6);
    p6.innerHTML = 'Shot Conversion Rate: ' + userStat.shotConversionRate;
    p6.classList.add("pad-this");

    const p7 = document.createElement("p");
    userStatDetails.append(p7);
    p7.innerHTML = 'Tackle Success Rate: ' + userStat.tackleSuccessRate;
    p7.classList.add("pad-this");

    const p8 = document.createElement("p");
    userStatDetails.append(p8);
    p8.innerHTML = 'Minutes on the Ball: ' + userStat.minutesOnBall;
    p8.classList.add("pad-this");

    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    userStatDetails.append(editButton);

    editButton.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit").innerHTML = "Edit User Stats";
    };

    populateEditForm(userStat);
};

const deleteUserStat = async (userStat) => {
    let response = await fetch(`/api/user-stats/${userStat._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
    
      if (response.status != 200) {
        console.log("error deleting");
        return;
      }
    
      let result = await response.json();
      showUserStats();
      document.getElementById("user-stat-details").innerHTML = "";
      resetForm();
};

const populateEditForm = (userStat) => {
    const form = document.getElementById("user-stat-form");
    console.log(userStat._id);
    form._id.value = userStat._id;
    form.name.value = userStat.name;
    form.age.value = userStat.age;
    form.height.value = userStat.height;
    form.weight.value = userStat.weight;
    form.preferredPosition.value = userStat.preferredPosition;
    form.passingAccuracy.value = userStat.passingAccuracy;
    form.dribbleSuccess.value = userStat.dribbleSuccess;
    form.shotConversionRate.value = userStat.shotConversionRate;
    form.tackleSuccessRate.value = userStat.tackleSuccessRate;
    form.minutesOnBall.value = userStat.minutesOnBall;
};

const addEditUserStat = async (e) => {
    e.preventDefault();
    const form = document.getElementById("user-stat-form");
    const formData = new FormData(form);
    const dataStatus = document.getElementById("data-status");
    let response;

    if (form._id.value == -1) {
        formData.delete("_id");
        response = await fetch("/api/user-stats", {
            method: "POST",
            body: formData
        });
    } else {
        response = await fetch(`/api/user-stats/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }

    if (response.status !== 200) {
        dataStatus.classList.remove("hidden");
        dataStatus.innerHTML = "Error Posting Data!";
        setTimeout(() => {
            dataStatus.classList.add("hidden");
        }, 3000);
        console.error("Error posting data");
        return;
    }

    userStat = await response.json();

    if (form._id.value != -1) {
        displayDetails(userStat);
    }

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showUserStats();
};

const resetForm = () => {
    const form = document.getElementById("user-stat-form");
    form.reset();
    form._id.value = "-1";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit").innerHTML = "Add User Stats";
    resetForm();
};

window.onload = () => {
    showUserStats();
    document.getElementById("user-stat-form").onsubmit = addEditUserStat;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };
};
