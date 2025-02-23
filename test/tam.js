function importFromExcel(event) {
    const file = event.target.files[0];

    if (!file) { 
        console.error("Không có file nào được chọn!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lấy dữ liệu từ sheet đầu tiên của workbook
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Lọc ra các môn học
        rows = rows.filter(row => row["Tên môn học"]);
                
      // Loại bỏ các mã học phần không hợp lệ
        rows = rows.map(row => {
            let courseCode = Number(row["Mã MH"]);
            return isNaN(courseCode) ? null : { ...row, "Mã MH": courseCode };
        }).filter(row => row);

        // Chuyển đổi dữ liệu sang object
        const formattedRows = rows.map(row => ({
            subject: row[0],        // Tên môn học
            credits: row[1],        // Số tín chỉ
            final_score: row[2],    // Điểm TK (10)
            letter_grade: row[3]    // Điểm TK (C)
        }));

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

            // Thêm nút Sửa và Xóa
            const actionsCell = newRow.insertCell(7);
            actionsCell.innerHTML = `
                <div class="btn-group">
                    <button onclick="editCourse(this)">Sửa</button>
                    <button class="delete-button" onclick="deleteCourse(this)">Xóa</button>
                </div>
            `;
        });

        // Cập nhật tổng điểm
        updateTotals();
    };

    reader.readAsArrayBuffer(file);
}