let selectedRow = null;

function calculateGrades(gradeC, gradeB, gradeA) {
    const grade10 = (gradeC * 0.1 + gradeB * 0.3 + gradeA * 0.6).toFixed(1);

    let grade4;
    if (grade10 < 4) {
        grade4 = "F";
    } else if (grade10 < 5) {
        grade4 = "D";
    } else if (grade10 < 5.5) {
        grade4 = "D+";
    } else if (grade10 < 6.5) {
        grade4 = "C";
    } else if (grade10 < 7) {
        grade4 = "C+";
    } else if (grade10 < 8) {
        grade4 = "B";
    } else if (grade10 < 8.5) {
        grade4 = "B+";
    } else if (grade10 < 9) {
        grade4 = "A";
    } else {
        grade4 = "A+";
    }
    return { grade10, grade4 };
}

function updateTotals() {
    const tableBody = document.getElementById('courseTableBody');
    let totalCredits = 0;
    let totalGrade10 = 0;
    let totalGrade4 = 0;
    let isEditing = false;
    let originalTotalGrade4 = 0;
    
    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const credits = parseInt(row.cells[1].innerText);
        const grade10 = parseFloat(row.cells[5].innerText);
        // Lấy giá trị điểm hệ 4 từ select trong cell[7]
        const selectEl = row.cells[7].querySelector("select");
        let grade4;
        let originalGrade4;
        
        if (selectEl) {
            grade4 = selectEl.value;
            originalGrade4 = row.cells[6].innerText.trim();
        } else {
            // Nếu không có select thì lấy giá trị gốc từ cell[6]
            grade4 = row.cells[6].innerText;
            originalGrade4 = grade4;
        }
        
        totalCredits += credits;
        // Xử lí khi sửa điểm chữ thì điểm hệ 10 không hiển thị
        if (grade4 !== originalGrade4) {
            isEditing = true;
        } else {
            totalGrade10 += credits * grade10;
        }
        
        totalGrade4 += credits * convertGrade4ToNumber(grade4);
        originalTotalGrade4 += credits * convertGrade4ToNumber(originalGrade4);
    }
    
    document.getElementById('totalCredits').innerText = totalCredits;
    
    if (isEditing) {
        document.getElementById('totalGrade10').innerText = "Đang sửa điểm chữ";
        document.getElementById('totalGrade10').style.color = "#B22222";
    } else {
        document.getElementById('totalGrade10').innerText = (totalGrade10 / totalCredits).toFixed(2);
        document.getElementById('totalGrade10').style.color = "";
    }
    
    const finalGPA = (totalGrade4 / totalCredits).toFixed(2);
    const originalGPA = (originalTotalGrade4 / totalCredits).toFixed(2);
    
    document.getElementById('totalGrade4').innerText = finalGPA;
    // Đổi màu dựa trên sự thay đổi của GPA
    if (parseFloat(finalGPA) > parseFloat(originalGPA)) {
        document.getElementById('totalGrade4').style.color = "#00FF00";
    } else if (parseFloat(finalGPA) < parseFloat(originalGPA)) {
        document.getElementById('totalGrade4').style.color = "#B22222  "; // Màu đỏ
    } else {
        document.getElementById('totalGrade4').style.color = ""; // Màu mặc định
    }
    handleGradeChange(finalGPA);
}

function convertGrade4ToNumber(grade4) {
    switch (grade4) {
        case "F":
            return 0.0;
        case "D":
            return 1.0;
        case "D+":
            return 1.5;
        case "C":
            return 2.0;
        case "C+":
            return 2.5;
        case "B":
            return 3.0;
        case "B+":
            return 3.5;
        case "A":
            return 3.7;
        case "A+":
            return 4.0;
        default:
            return 0;
    }
}   
function addCourse() {
  const courseName = document.getElementById('courseName').value;
  const creditHours = document.getElementById('creditHours').value;
  const gradeC = parseFloat(document.getElementById('gradeC').value);
  const gradeB = parseFloat(document.getElementById('gradeB').value);
  const gradeA = parseFloat(document.getElementById('gradeA').value);

  //Kiểm tra
  if (!courseName || !creditHours || isNaN(gradeC) || isNaN(gradeB) || isNaN(gradeA)) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
  }
  if (gradeC < 0 || gradeC > 10 || gradeB < 0 || gradeB > 10 || gradeA < 0 || gradeA > 10) {
      alert("Điểm phải nằm trong khoảng từ 0 đến 10.");
      return;
  }

  const { grade10, grade4 } = calculateGrades(gradeC, gradeB, gradeA);
  if (isHidden) {
    toggleCells();
    }
  const tableBody = document.getElementById('courseTableBody');
  if (selectedRow) {
      selectedRow.cells[0].innerText = courseName;
      selectedRow.cells[1].innerText = creditHours;
      selectedRow.cells[2].innerText = gradeC;
      selectedRow.cells[3].innerText = gradeB;
      selectedRow.cells[4].innerText = gradeA;
      selectedRow.cells[5].innerText = grade10;
      selectedRow.cells[6].innerText = grade4;
      selectedRow.cells[7].innerHTML = `
        <select class="form-select grade-select" onchange="changeGradeColor(this, '${grade4}'); updateTotals();">
          <option value="A+" ${grade4 === "A+" ? "selected" : ""}>A+</option>
          <option value="A" ${grade4 === "A" ? "selected" : ""}>A</option>
          <option value="B+" ${grade4 === "B+" ? "selected" : ""}>B+</option>
          <option value="B" ${grade4 === "B" ? "selected" : ""}>B</option>
          <option value="C+" ${grade4 === "C+" ? "selected" : ""}>C+</option>
          <option value="C" ${grade4 === "C" ? "selected" : ""}>C</option>
          <option value="D+" ${grade4 === "D+" ? "selected" : ""}>D+</option>
          <option value="D" ${grade4 === "D" ? "selected" : ""}>D</option>
          <option value="F" ${grade4 === "F" ? "selected" : ""}>F</option>
        </select>
    `;
      selectedRow = null;
  } else {
    const newRow = tableBody.insertRow(0);
    newRow.insertCell(0).innerText = courseName;
    newRow.insertCell(1).innerText = creditHours;
    newRow.insertCell(2).innerText = gradeC;
    newRow.insertCell(3).innerText = gradeB;
    newRow.insertCell(4).innerText = gradeA;
    newRow.insertCell(5).innerText = grade10;
    newRow.insertCell(6).innerText = grade4;
    const gradeCell = newRow.insertCell(7);
        gradeCell.innerHTML = `
            <select class="form-select grade-select" onchange="changeGradeColor(this, '${grade4}'); updateTotals();">
              <option value="A+" ${grade4 === "A+" ? "selected" : ""}>A+</option>
              <option value="A" ${grade4 === "A" ? "selected" : ""}>A</option>
              <option value="B+" ${grade4 === "B+" ? "selected" : ""}>B+</option>
              <option value="B" ${grade4 === "B" ? "selected" : ""}>B</option>
              <option value="C+" ${grade4 === "C+" ? "selected" : ""}>C+</option>
              <option value="C" ${grade4 === "C" ? "selected" : ""}>C</option>
              <option value="D+" ${grade4 === "D+" ? "selected" : ""}>D+</option>
              <option value="D" ${grade4 === "D" ? "selected" : ""}>D</option>
              <option value="F" ${grade4 === "F" ? "selected" : ""}>F</option>
            </select>
        `;
    const actionsCell = newRow.insertCell(8);
    actionsCell.innerHTML = `
        <div class="btn-group">
          <button onclick="editCourse(this)">Sửa</button>
          <button class="delete-button" onclick="deleteCourse(this)">Xóa</button>
        </div>
    `;
  }

  document.getElementById('courseName').value = '';
  document.getElementById('creditHours').value = '';
  document.getElementById('gradeC').value = '';
  document.getElementById('gradeB').value = '';
  document.getElementById('gradeA').value = '';

  updateTotals();
  tableBody.scrollIntoView({ behavior: "smooth", block: "start" });

}
function editCourse(button) {
    const courseForm = document.getElementById('courseForm');
    if (courseForm.style.display !== "block") {
        toggleCourseForm(button);
    }
    selectedRow = button.parentElement.parentElement.parentElement;
    document.getElementById('courseName').value = selectedRow.cells[0].innerText;
    document.getElementById('creditHours').value = selectedRow.cells[1].innerText;
    document.getElementById('gradeC').value = selectedRow.cells[2].innerText;
    document.getElementById('gradeB').value = selectedRow.cells[3].innerText;
    document.getElementById('gradeA').value = selectedRow.cells[4].innerText;
    // Scroll the page to show the course form
    courseForm.scrollIntoView({ behavior: "smooth", block: "end" });
}

function deleteCourse(button) {
    const row = button.parentElement.parentElement.parentElement;
    row.remove();
    updateTotals();
}
document.getElementById('uploadBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) { 
        alert("Vui lòng chọn file trước!");
        return;
    }
    importFromExcel(file);
});

// Hàm nhập từ Excel
function importFromExcel(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lấy dữ liệu từ sheet đầu tiên của workbook
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let rows = XLSX.utils.sheet_to_json(worksheet);
        // Nếu file excel chứa các cột này thì nhập dữ liệu vào bảng luôn
        const expectedHeaders = ["Tên học phần", "Tín chỉ", "Điểm C", "Điểm B", "Điểm A", "Điểm hệ 10", "Điểm hệ 4"];
        const fileHeaders = Object.keys(rows[0]);
        let formattedRows;
        // Check xem có phải file cũ đã xuất từ hệ thống
        if (
        fileHeaders.length === expectedHeaders.length &&
        fileHeaders.every((header, index) => header === expectedHeaders[index])
        ) {
           // Chuyển đổi dữ liệu sang object
        formattedRows = rows.map(row => ({
            subject: row["Tên học phần"],
            credits: row["Tín chỉ"],
            final_score: row["Điểm hệ 10"],
            letter_grade: row["Điểm hệ 4"]
            }));
        }
        else{
            // Lọc ra các môn học
            rows = rows.filter(row => row["Tên môn học"]);
            const list_course = new Set(['7300101','7300102','7300201','7300103','7300104','7300202','7300203','7010701','7010702','7010703']);
            
            // Loại bỏ các mã học phần không hợp lệ
            rows = rows.map(row => {
                let courseCode = row["Mã MH"] ? row["Mã MH"].toString().trim() : ""; // Chuyển về chuỗi và loại bỏ khoảng trắng
                return isNaN(Number(courseCode)) || list_course.has(courseCode) ? null : { ...row, "Mã MH": Number(courseCode) };
            }).filter(row => row !== null);
            // Nếu môn học có nhiều lần xuất hiện, xác định điểm tổng (Điểm TK (10)) cao nhất cho mỗi mã MH
            const maxScores = {};
            rows.forEach(row => {
                const code = row["Mã MH"];
                const score = Number(row["Điểm TK (10)"]);
                if (maxScores[code] === undefined || score > maxScores[code]) {
                    maxScores[code] = score;
                }
            });
            // Tạo ra biến uniqueRows giữ nguyên thứ tự danh sách điểm gốc, chỉ giữ lại những dòng có điểm TK (10) cao nhất
            const uniqueRows = rows.filter(row => Number(row["Điểm TK (10)"]) === maxScores[row["Mã MH"]]);
            rows = uniqueRows;
            // Chuyển đổi dữ liệu sang object
            formattedRows = rows.map(row => ({
                course_code: row["Mã MH"],
                subject: row["Tên môn học"],
                credits: row["Số tín chỉ"],
                final_score: row["Điểm TK (10)"],
                letter_grade: row["Điểm TK (C)"]
            }));
        }
        // Hiển thị điểm thành phần nếu đang ẩn
        if (isHidden) {
            toggleCells();
        }
        // Thêm dữ liệu vào bảng
        const tableBody = document.getElementById('courseTableBody');
        tableBody.innerHTML = ""; // Xóa dữ liệu cũ

        formattedRows.forEach(row => {
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).innerText = row.subject;
            newRow.insertCell(1).innerText = row.credits;
            newRow.insertCell(2).innerText = "";
            newRow.insertCell(3).innerText = "";
            newRow.insertCell(4).innerText = "";
            newRow.insertCell(5).innerText = row.final_score;
            newRow.insertCell(6).innerText = row.letter_grade;
            const gradeCell = newRow.insertCell(7);
            gradeCell.innerHTML = `
                <select class="form-select grade-select" onchange="changeGradeColor(this, '${row.letter_grade}'); updateTotals();">
                    <option value="A+" ${row.letter_grade === "A+" ? "selected" : ""}>A+</option>
                    <option value="A" ${row.letter_grade === "A" ? "selected" : ""}>A</option>
                    <option value="B+" ${row.letter_grade === "B+" ? "selected" : ""}>B+</option>
                    <option value="B" ${row.letter_grade === "B" ? "selected" : ""}>B</option>
                    <option value="C+" ${row.letter_grade === "C+" ? "selected" : ""}>C+</option>
                    <option value="C" ${row.letter_grade === "C" ? "selected" : ""}>C</option>
                    <option value="D+" ${row.letter_grade === "D+" ? "selected" : ""}>D+</option>
                    <option value="D" ${row.letter_grade === "D" ? "selected" : ""}>D</option>
                    <option value="F" ${row.letter_grade === "F" ? "selected" : ""}>F</option>
                </select>
            `;

            // Thêm nút Sửa và Xóa
            const actionsCell = newRow.insertCell(8);
            actionsCell.innerHTML = `
                <div class="btn-group">
                    <button onclick="editCourse(this)">Sửa</button>
                    <button class="delete-button" onclick="deleteCourse(this)">Xóa</button>
                </div>`;
        });
        // Cập nhật tổng điểm
        updateTotals();
        tableBody.scrollIntoView({ behavior: "smooth", block: "start" });

    };
    reader.readAsArrayBuffer(file);
} 
function changeGradeColor(selectElement, originalGrade) {
    const gradeOrder = ["F", "D", "D+", "C", "C+", "B", "B+", "A", "A+"]; // Thứ tự điểm
    const selectedGrade = selectElement.value;
    
    const originalIndex = gradeOrder.indexOf(originalGrade);
    const selectedIndex = gradeOrder.indexOf(selectedGrade);

    // Lấy ô chứa select (td)
    const cell = selectElement.parentElement;

    if (selectedIndex > originalIndex) {
        // Xanh lá nếu tăng điểm
        cell.style.color = "white";
    } else if (selectedIndex < originalIndex) {
        cell.style.backgroundColor = "#F44336"; // Đỏ nếu giảm điểm
        cell.style.color = "white";
    } else {
        cell.style.backgroundColor = ""; // Trả về mặc định nếu không đổi
        cell.style.color = "";
    }
}
 // Xử lý khi người dùng thay đổi điểm
 function handleGradeChange(totalGrade4) {
    
    showCustomToast(`GPA đã thay đổi thành ${totalGrade4}`);
}
// Hiển thị Toast thông báo
function showCustomToast(message, bgClass = 'bg-success') {
    const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
    
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 fade show" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    document.getElementById('toastContainer').insertAdjacentHTML('beforeend', toastHTML);

    let toastElement = document.getElementById(toastId);
    let toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        toast.hide();
        setTimeout(() => toastElement.remove(), 500);
    }, 2000);
}

let isHidden = false;
function toggleCells() {
    const table = document.getElementById("courseTableBody");
    const headers = document.querySelectorAll("thead th");

    // Ẩn/hiện các cột trong hàng dữ liệu
    for (let i = 0; i < table.rows.length; i++) {
        table.rows[i].cells[2].classList.toggle("hidden-column");
        table.rows[i].cells[3].classList.toggle("hidden-column");
        table.rows[i].cells[4].classList.toggle("hidden-column");
    }

    // Ẩn/hiện tiêu đề cột
    headers[2].classList.toggle("hidden-column");
    headers[3].classList.toggle("hidden-column");
    headers[4].classList.toggle("hidden-column");

    // Cập nhật trạng thái và đổi tên nút
    isHidden = !isHidden;
    document.querySelector(".round-button").innerText = isHidden ? "Hiện điểm thành phần" : "Ẩn điểm thành phần";
}
function toggleCourseForm(button) {
    var form = document.getElementById("courseForm");
    var btn = document.getElementById("toggleFormButton");

    // Nếu form đang ẩn, hiển thị form và cập nhật nội dung button theo trạng thái (thêm hay sửa)
    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
        // Nếu có giá trị selectedRow (đang ở chế độ sửa) thì cập nhật button text cho sửa
        if (selectedRow) {
            btn.innerText = "Ẩn sửa học phần";
        } else {
            btn.innerText = "Ẩn thêm học phần";
        }
    } else {
        // Nếu form đang hiển thị và người dùng bấm nút, ẩn form
        form.style.display = "none";
        if (selectedRow) {
            // Chỉ đặt lại các giá trị khi đang sửa
            document.getElementById('courseName').value = '';
            document.getElementById('creditHours').value = '';
            document.getElementById('gradeC').value = '';
            document.getElementById('gradeB').value = '';
            document.getElementById('gradeA').value = '';
            // Reset trạng thái sửa
            selectedRow = null;
        }
        btn.innerText = "Thêm học phần";
    }
}
function exportToExcel() {
    const rows = [["Tên học phần", "Tín chỉ", "Điểm C", "Điểm B", "Điểm A", "Điểm hệ 10", "Điểm hệ 4"]];
    const table = document.getElementById("courseTableBody");

    for (let i = 0; i < table.rows.length; i++) {
        const rowData = [];
        for (let j = 0; j < (table.rows[i].cells.length)-2; j++) {
            rowData.push(table.rows[i].cells[j].innerText);
        }
        rows.push(rowData);
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Course Grades");

    // Tạo Blob từ Workbook và tải xuống
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    saveAs(blob, "course_grades.xlsx"); // Sử dụng thư viện FileSaver.js để tải xuống file

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}
function suggestImprovements() {
    const tableBody = document.getElementById('courseTableBody');
    let suggestions = [];

    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const courseName = row.cells[0].innerText;
        const credits = parseInt(row.cells[1].innerText);
        const grade4 = row.cells[6].innerText;
        
        // Chọn các môn có điểm thấp để gợi ý cải thiện
        if (grade4 === "F" || grade4 === "D" || grade4 === "D+" || grade4 === "C" || grade4 === "C+") {
            suggestions.push({
                courseName,
                credits,
                grade4,
                priority: credits * (grade4 === "F" ? 3 : grade4 === "D" ? 2 : 1)
            });
        }
    }

    // Sắp xếp theo thứ tự ưu tiên
    suggestions.sort((a, b) => {
        // 1️⃣ So sánh điểm hệ 4
        if (b.priority !== a.priority) return b.priority - a.priority;

        // 2️⃣ So sánh tín chỉ
        if (b.credits !== a.credits) return b.credits - a.credits;

        // 3️⃣ So sánh điểm hệ 10 (ưu tiên thấp hơn)
        if (a.grade10 !== b.grade10) return a.grade10 - b.grade10;

        // 4️⃣ So sánh điểm thi (ưu tiên thấp hơn)
        return a.examScore - b.examScore;
    });

    const suggestionList = document.getElementById("suggestionList");
    suggestionList.innerHTML = ""; // Xóa danh sách cũ

    if (suggestions.length > 0) {
        suggestions.forEach(s => {
            let listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.innerHTML = `<b>${s.courseName}</b> (${s.credits} tín chỉ, điểm <span class="badge bg-danger">${s.grade4}</span>)`;
            suggestionList.appendChild(listItem);
        });

        // Hiển thị modal
        let suggestionModal = new bootstrap.Modal(document.getElementById('suggestionModal'));
        suggestionModal.show();
    } else {
        alert("Không có môn học nào cần cải thiện!");
    }
}
// Hàm lưu dữ liệu bảng điểm vào localStorage
function saveToLocalStorage() {
    const tableBody = document.getElementById('courseTableBody');
    const courses = [];

    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const course = {
            courseName: row.cells[0].innerText,
            creditHours: row.cells[1].innerText,
            gradeC: row.cells[2].innerText,
            gradeB: row.cells[3].innerText,
            gradeA: row.cells[4].innerText,
            grade10: row.cells[5].innerText,
            grade4: row.cells[6].innerText
        };
        courses.push(course);
    }

    localStorage.setItem('courseGrades', JSON.stringify(courses));
}

// Hàm tải dữ liệu từ localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('courseGrades');
    if (savedData) {
        const courses = JSON.parse(savedData);
        const tableBody = document.getElementById('courseTableBody');
        tableBody.innerHTML = ''; // Xóa dữ liệu cũ

        courses.forEach(course => {
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).innerText = course.courseName;
            newRow.insertCell(1).innerText = course.creditHours;
            newRow.insertCell(2).innerText = course.gradeC;
            newRow.insertCell(3).innerText = course.gradeB;
            newRow.insertCell(4).innerText = course.gradeA;
            newRow.insertCell(5).innerText = course.grade10;
            newRow.insertCell(6).innerText = course.grade4;

            const gradeCell = newRow.insertCell(7);
            gradeCell.innerHTML = `
                <select class="form-select grade-select" onchange="changeGradeColor(this, '${course.grade4}'); updateTotals();">
                    <option value="A+" ${course.grade4 === "A+" ? "selected" : ""}>A+</option>
                    <option value="A" ${course.grade4 === "A" ? "selected" : ""}>A</option>
                    <option value="B+" ${course.grade4 === "B+" ? "selected" : ""}>B+</option>
                    <option value="B" ${course.grade4 === "B" ? "selected" : ""}>B</option>
                    <option value="C+" ${course.grade4 === "C+" ? "selected" : ""}>C+</option>
                    <option value="C" ${course.grade4 === "C" ? "selected" : ""}>C</option>
                    <option value="D+" ${course.grade4 === "D+" ? "selected" : ""}>D+</option>
                    <option value="D" ${course.grade4 === "D" ? "selected" : ""}>D</option>
                    <option value="F" ${course.grade4 === "F" ? "selected" : ""}>F</option>
                </select>
            `;

            const actionsCell = newRow.insertCell(8);
            actionsCell.innerHTML = `
                <div class="btn-group">
                    <button onclick="editCourse(this)">Sửa</button>
                    <button class="delete-button" onclick="deleteCourse(this)">Xóa</button>
                </div>`;
        });

        updateTotals();
    }
}

// // Lưu dữ liệu sau khi thêm, sửa hoặc xóa môn học
// const originalAddCourse = addCourse;
// addCourse = function() {
//     originalAddCourse.apply(this, arguments);
//     saveToLocalStorage();
// };

// const originalDeleteCourse = deleteCourse;
// deleteCourse = function() {
//     originalDeleteCourse.apply(this, arguments);
//     saveToLocalStorage();
// };

// // Lưu dữ liệu sau khi upload file Excel
// const originalImportFromExcel = importFromExcel;
// importFromExcel = function(file) {
//     originalImportFromExcel.call(this, file);
//     // Thêm timeout ngắn để đảm bảo dữ liệu đã được xử lý xong
//     setTimeout(() => {
//         saveToLocalStorage();
//     }, 100);
// };

// Tải dữ liệu khi trang web được tải
document.addEventListener('DOMContentLoaded', saveToLocalStorage);
