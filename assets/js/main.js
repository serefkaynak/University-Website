async function fetchData(url) {
    let response = await fetch(url);
    return response.json();
}

async function updateUniversityName() {
    let data = await fetchData("data/faculty.json");
    document.getElementById("university_name").innerText = data['SchoolName'];
    populateFacultyList(data.faculty);
}

function populateFacultyList(facultyData) {
    let facultyListElement = document.getElementById("faculty_list");
    facultyData.forEach(faculty => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<a href="detail.html?facultyId=${faculty.faculty_id}">${faculty.position} ${faculty.first_name} ${faculty.last_name} - ${faculty.department}</a>`;
        facultyListElement.appendChild(listItem);
    });
}

function getFacultyIdFromQueryString() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('facultyId');
}

async function displayDetails() {
    const facultyId = getFacultyIdFromQueryString();
    const lessonsData = await fetchData("data/lessons.json");
    const studentsData = await fetchData("data/students.json");
    
    const facultyLessons = lessonsData.lessons.filter(lesson => lesson.faculty === facultyId);
    populateList("lessonList", facultyLessons, "subject");
    

    const facultyStudents = studentsData.students.filter(student => student.faculty_advisor === facultyId);
    populateList("studentList", facultyStudents, "first_name");
}

function populateList(listId, data, fieldName) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = '';
    data.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item[fieldName];
        listElement.appendChild(listItem);
    });
}

window.onload = function() {
    if (document.getElementById("university_name")) {
        updateUniversityName();
    } else if (document.getElementById("lessonList")) {
        displayDetails();
    }
};
