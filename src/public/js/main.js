const HOST = "http://localhost:8080";

$(document).ready(() => {    
    // *******************************************************
    // ********** view/Product/ProductCreate.php
    // *******************************************************

    // Function to handle create product form
    $('#product_create_form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: 'api/Product/ProductPost.api.php',
            data: $('form').serialize(),
            success: function() {
                window.location.reload();
            }
        });
    });

    // *******************************************************
    // ********** view/Common/Header.php
    // *******************************************************


    // Hàm thay đổi header khi scroll
    function _headerScrolled() {
        let header = document.getElementById('header')
        if (window.scrollY > 0) {
            header.classList.add('header-scrolled')
        } else {
            header.classList.remove('header-scrolled')
        }
    };

    // Gọi hàm _headerScrolled khi scroll
    $(document).scroll(_headerScrolled);


    // Khi click vào nút mobile menu thì thêm xóa các class liên quan để 
    // hiển thị giao diện phù hợp
    $('.mobile-nav-toggle').click((e) => {
        let navbar = document.getElementById('navbar')
        navbar.classList.toggle('navbar-mobile')
        e.target.classList.toggle('fa-bars')
        e.target.classList.toggle('fa-times')

        let dropdownActives = document.querySelectorAll('.navbar .dropdown > a')
        dropdownActives.forEach(dropdownActive => {
            dropdownActive.nextElementSibling.classList.remove('dropdown-active')
        });

        let dropdownArrowsM = document.querySelectorAll('.navbar .dropdown .dropdown-icon-mobile')
        dropdownArrowsM.forEach(el => {
            //reset chiều icon
            el.classList.replace('fa-chevron-down', 'fa-chevron-right')
            let dropdown = el.parentElement
                // bắt click dropdown thay đổi icon
            $(dropdown).bind('click.changeArrow', e => {
                el.classList.toggle('fa-chevron-right')
                el.classList.toggle('fa-chevron-down')
            })
        })
    });

    // Bắt sự kiện click dropdown
    let dropdownActives = document.querySelectorAll('.navbar .dropdown > a')
    dropdownActives.forEach(dropdownActive => {
        $(dropdownActive).click(e => {
            if (e.target.nextElementSibling) {
                e.target.nextElementSibling.classList.toggle('dropdown-active')
            }
        });
    });
    let dropdownArrowsM = document.querySelectorAll('.navbar .dropdown .dropdown-icon-mobile')
    dropdownArrowsM.forEach(el => {
        // bắt click arrow để dropdown 
        $(el).bind('click', e => {
            el.parentElement.nextElementSibling.classList.toggle('dropdown-active')
        })
    })

    //Ngừng scroll khi bật navbar-mobile
    $(document).scroll(e => {
        if (document.querySelector('.navbar-mobile') !== null) {
            _disableScroll();
        } else {
            _enableScroll();
        }
    });

    function _disableScroll() {
        window.onscroll = function() {
            window.scrollTo(0, 0);
        };
    }

    function _enableScroll() {
        window.onscroll = function() {};
    }

    //drag to scroll task-manager-container

    const slider = $('.task-manager-container')[0];
    let isMouseDown = false;
    let startX;
    let scrollLeft;

    $(slider).mousedown(e => {
        isMouseDown = true;
        slider.classList.add('scroll-active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    $(slider).mouseleave(e => {
        isMouseDown = false;
        slider.classList.remove('scroll-active');
    });

    $(slider).mouseup(e => {
        isMouseDown = false;
        slider.classList.remove('scroll-active');
    });
    $(slider).mousemove(e => {
        if (!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });


    // *******************************************************
    // ********** view/Task/TaskManagement.php
    // *******************************************************

    // ********** Confirm modal when task has been rejected
    // Bắt sự kiện nhấn Xem modal
    let rejectedBtns = document.querySelectorAll('.reject-task-js')

    function _showRejectedTask() {
        let rejectedModal = document.getElementById('task-rejected-overlay')
        rejectedModal.classList.add('task-rejected-active')
    }

    function _hideRejectedTask() {
        let rejectedModal = document.getElementById('task-rejected-overlay')
        rejectedModal.classList.remove('task-rejected-active')
    }

    // Nhấn section để hiện modal
    rejectedBtns.forEach(btn => {
        $(btn).click((e) => {
            _showRejectedTask();
        });
    });

    // Nhấn "x" đóng modal
    $('.task-rejected-close').click((e) => {
        _hideRejectedTask();
    });

    // Nhấn overlay vẫn đóng được modal
    $('#task-rejected-overlay:not(#task-rejected-modal)').click((e) => {
        _hideRejectedTask();
    });

    $('#task-rejected-modal').click((e) => {
        e.stopPropagation()
    });

    // ********** Confirm modal when task has been completed
    // Bắt sự kiện nhấn Xem modal
    let approvedBtns = document.querySelectorAll('.approve-task-js')

    function _showSuccessTask() {
        let approvedModal = document.getElementById('task-success-overlay')
        approvedModal.classList.add('task-success-active')
    }

    function _hideSuccessTask() {
        let approvedModal = document.getElementById('task-success-overlay')
        approvedModal.classList.remove('task-success-active')
    }

    // Nhấn section để hiện modal
    approvedBtns.forEach(btn => {
        $(btn).click((e) => {
            _showSuccessTask();
        });
    });

    // Nhấn "x" đóng modal
    $('.task-success-close').click((e) => {
        _hideSuccessTask();
    });

    // Nhấn overlay vẫn đóng được modal
    $('#task-success-overlay:not(#task-success-modal)').click((e) => {
        _hideSuccessTask();
    });

    $('#task-success-modal').click((e) => {
        e.stopPropagation()
    });

    // ********** History task modal
    // Bắt sự kiện nhấn Xem lịch sử task
    let historySection = document.querySelectorAll('.history-section')

    // Nhấn section để hiện modal
    historySection.forEach(btn => {
        $(btn).click((e) => {
            _showHistoryTask();
        });
    });

    // Nhấn "x" đóng modal
    $('.history-task-close').click((e) => {
        _hideHistoryTask();
    });

    // Nhấn nút Đóng để đóng modal
    $('.close-history-btn').click((e) => {
        _hideHistoryTask();
    });

    // Nhấn overlay vẫn đóng được modal
    $('#task-history-overlay:not(#task-history-modal)').click((e) => {
        _hideHistoryTask();
    });

    $('#task-history-modal').click((e) => {
        e.stopPropagation()
    });


    // ********** Create task modal
    // Bắt sự kiện nhấn nút để Tạo task mới
    function _showCreateTask() {
        let createTaskForm = document.getElementById('create-task-overlay')
        createTaskForm.classList.add('create-task-active')
    }

    function _hideCreateTask() {
        let createTaskForm = document.getElementById('create-task-overlay')
        createTaskForm.classList.remove('create-task-active')
    }

    $('#create-new-task__btn').click((e) => {
        _showCreateTask();
    });

    // Nhấn "x" đóng modal
    $('.create-task-close').click((e) => {
        _hideCreateTask();
    });

    // Nhấn nút Đóng để đóng modal
    $('.close-create-btn').click((e) => {
        _hideCreateTask();
    });

    // Nhấn overlay vẫn đóng được modal
    $('#create-task-overlay:not(#create-task-modal)').click((e) => {
        _hideCreateTask();
    });

    $('#create-task-modal').click((e) => {
        e.stopPropagation()
    });

    // Hiện tên file khi select 
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });


    // Tạo task mới
    $('#create-task-form').on('submit', function(e) {
        e.preventDefault();
        $("#message_create_task").css("display", "none");

        let form = new FormData(document.getElementById('create-task-form'));

        form.append('ten_task', $('#create-task-name').val());
        form.append('mo_ta', $('#create-task-desc').val());
        form.append('thoi_gian_deadline', $('#task-deadline').val());
        form.append('nguoi_thuc_hien_id', $('#select-nhanvien').val());


        var settings = {
            "url": "/task/create",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText == "Success") {
                        window.location.replace(`${window.location.pathname}?status=created`)
                    } else {
                        $("#message_create_task").css("display", "block");
                        $("#message_create_task").html(e.responseText);
                    };
                } else {
                    $("#message_create_task").css("display", "block");
                    $("#message_create_task").html(e.responseText);
                }
            }
        }
        $.ajax(settings);
        
    });

    // Xem chi tiết new task
    let newTaskDetailBtns = document.querySelectorAll('.new-column .detail-btn');
    Array.from(newTaskDetailBtns).forEach((btn) => {
        $(btn).click(e => {
            let newTaskDetailInfo;
            let id = $(btn).children().val();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: { 'task_id': id },
                url: "/task/getTaskDetail",
                success: function(data) {
                    newTaskDetailInfo = data;
                    $(document.querySelector('#new-task-modal .modal-title')).html(data.ten_task);
                    $(document.querySelector('#new-task-modal .task-detail-phongban')).html(data.ten_phong);

                    let thoi_gian_deadline_date = new Date(data.thoi_gian_deadline);
                    
                    let dateString = moment(data.thoi_gian_deadline).format('DD/MM/YYYY');
                    var timeString = moment(data.thoi_gian_deadline).format('HH:mm');

                    $(document.querySelector('#new-task-modal .task-detail-date')).html(dateString);
                    $(document.querySelector('#new-task-modal .task-detail-time')).html(timeString);

                    $(document.querySelector('#new-task-modal #task-deadline')).attr('value', moment(data.thoi_gian_deadline).format('YYYY-MM-DDTHH:mm'))


                    if (new Date() < thoi_gian_deadline_date) {
                        let timeRemainingString = data.days + "d " + data.hours + "h " + data.minutes + 'm';
                        $(document.querySelector('#new-task-modal .task-time-remaining')).html(timeRemainingString);
                    }
                    else {
                        $(document.querySelector('#new-task-modal .task-time-remaining')).html("Quá hạn");
                    }
                    $(document.querySelector('#new-task-modal #task-deadline-update')).val(moment(data.thoi_gian_deadline).format('YYYY-MM-DDTHH:mm'));
                    $(document.querySelector('#new-task-modal .task-member')).html(data.ho_ten);
                    $(document.querySelector('#new-task-modal .task-desc-input')).html(data.task_mo_ta);
                    if(data.tap_tin != null) {
                        $("#new-task-modal #task-detail-file").html(data.tap_tin.slice(data.tap_tin.lastIndexOf('/') + 1 ));
                        $("#new-task-modal #task-detail-file").attr("href", data.tap_tin);
                    }

                    $("#update-task-btn").attr("value",data['task_new_id']);
                }
            });
        });
    });

    // Xem chi tiết in-progress task
    let inProgressTaskDetailBtns = document.querySelectorAll('.in-progress-column .detail-btn');
    Array.from(inProgressTaskDetailBtns).forEach((btn) => {
        $(btn).click(e => {
            let inProgressTaskDetailInfo;
            let id = $(btn).children().val();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: { 'task_id': id },
                url: "/task/getTaskDetail",
                success: function(data) {
                    inProgressTaskDetailInfo = data;
                    $(document.querySelector('#progress-task-modal .modal-title')).html(data.ten_task);
                    $(document.querySelector('#progress-task-modal .task-detail-phongban')).html(data.ten_phong);

                    let thoi_gian_deadline_date = new Date(data.thoi_gian_deadline);
                    let dateString = moment(data.thoi_gian_deadline).format('DD/MM/YYYY');
                    var timeString = moment(data.thoi_gian_deadline).format('HH:mm');

                    $(document.querySelector('#progress-task-modal .task-detail-date')).html(dateString);
                    $(document.querySelector('#progress-task-modal .task-detail-time')).html(timeString);

                    if (new Date() < thoi_gian_deadline_date) {
                        let timeRemainingString = data.days + "d " + data.hours + "h " + data.minutes + 'm';
                        $(document.querySelector('#progress-task-modal .task-time-remaining')).html(timeRemainingString);
                    }
                    else {
                        $(document.querySelector('#progress-task-modal .task-time-remaining')).html("Quá hạn");
                    }
                    $(document.querySelector('#progress-task-modal #new-deadline-input')).val(moment(data.thoi_gian_deadline).format('YYYY-MM-DDTHH:mm'));
                    $(document.querySelector('#progress-task-modal .task-member')).html(data.ho_ten);
                    $(document.querySelector('#progress-task-modal .task-desc-input')).html(data.task_mo_ta);

                    if(data.tap_tin != null) {
                        $("#progress-task-modal #task-detail-file").html(data.tap_tin.slice(data.tap_tin.lastIndexOf('/') + 1 ));
                        $("#progress-task-modal #task-detail-file").attr("href", data.tap_tin);
                    }
                }
            });
        });
    });

    // Xem chi tiết cancel task
    let cancelTaskDetailBtns = document.querySelectorAll('.canceled-column .detail-btn');
    Array.from(cancelTaskDetailBtns).forEach((btn) => {
        $(btn).click(e => {
            let cancelTaskDetailInfo;
            let id = $(btn).children().val();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: { 'task_id': id },
                url: "/task/getTaskDetail",
                success: function(data) {
                    cancelTaskDetailInfo = data;
                    $(document.querySelector('#canceled-task-modal .modal-title')).html(data.ten_task);
                    $(document.querySelector('#canceled-task-modal .task-detail-phongban')).html(data.ten_phong);

                    let thoi_gian_deadline_date = new Date(data.thoi_gian_deadline);
                    let dateString = moment(data.thoi_gian_deadline).format('DD/MM/YYYY');
                    var timeString = moment(data.thoi_gian_deadline).format('HH:mm');

                    $(document.querySelector('#canceled-task-modal .task-detail-date')).html(dateString);
                    $(document.querySelector('#canceled-task-modal .task-detail-time')).html(timeString);

                    if (new Date() < thoi_gian_deadline_date) {
                        let timeRemainingString = data.days + "d " + data.hours + "h " + data.minutes + 'm';
                        $(document.querySelector('#canceled-task-modal .task-time-remaining')).html(timeRemainingString);
                    }
                    else {
                        $(document.querySelector('#canceled-task-modal .task-time-remaining')).html("Quá hạn");
                    }
                    $(document.querySelector('#canceled-task-modal #new-deadline-input')).val(moment(data.thoi_gian_deadline).format('YYYY-MM-DDTHH:mm'));
                    $(document.querySelector('#canceled-task-modal .task-member')).html(data.ho_ten);
                    $(document.querySelector('#canceled-task-modal .task-desc-input')).html(data.task_mo_ta);

                    if(data.tap_tin != null) {
                        $("#canceled-task-modal #task-detail-file").html(data.tap_tin.slice(data.tap_tin.lastIndexOf('/') + 1 ));
                        $("#canceled-task-modal #task-detail-file").attr("href", data.tap_tin);
                    }
                }
            });
        });
    });

    // Xem chi tiết waiting task
    let waitingTaskDetailBtns = document.querySelectorAll('.waiting-column .detail-btn');
    Array.from(waitingTaskDetailBtns).forEach((btn) => {
        $(btn).click(e => {
            let waitingTaskDetailInfo;
            let id = $(btn).children().val();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: { 'task_id': id },
                url: "/task/getTaskDetail",
                success: function(data) {
                    waitingTaskDetailInfo = data;
                    $(document.querySelector('#waiting-task-modal .modal-title')).html(data.ten_task);
                    $(document.querySelector('#waiting-task-modal .task-detail-phongban')).html(data.ten_phong);

                    let thoi_gian_deadline_date = new Date(data.thoi_gian_deadline);
                    let dateString = moment(data.thoi_gian_deadline).format('DD/MM/YYYY');
                    let timeString = moment(data.thoi_gian_deadline).format('HH:mm');


                    $(document.querySelector('#waiting-task-modal .task-detail-date')).html(dateString);
                    $(document.querySelector('#waiting-task-modal .task-detail-time')).html(timeString);
                    $(document.querySelector('#waiting-task-modal .time-submit-manage')).html(timeString + ", "+ dateString);

                    if (new Date() < thoi_gian_deadline_date) {
                        let timeRemainingString = data.days + "d " + data.hours + "h " + data.minutes + 'm';
                        $(document.querySelector('#waiting-task-modal .task-time-remaining')).html(timeRemainingString);
                    }
                    else {
                        $(document.querySelector('#waiting-task-modal .task-time-remaining')).html("Quá hạn");
                    }
                    $(document.querySelector('#waiting-task-modal #new-deadline-input')).val(moment(data.thoi_gian_deadline).format('YYYY-MM-DDTHH:mm'));
                    $(document.querySelector('#task-deadline-extend')).val(moment(data.thoi_gian_deadline).format('YYYY-MM-DDTHH:mm'));
                    $(document.querySelector('#waiting-task-modal .task-member')).html(data.ho_ten);
                    $(document.querySelector('#waiting-task-modal .task-desc-input')).html(data.task_mo_ta);
                    $(document.querySelector('#waiting-task-modal #waiting-submit-task-input')).html(data.mo_ta_nop);
                    if(data.tap_tin != null) {
                        $("#waiting-task-modal #waiting-task-detail-file").attr("href", data.tap_tin);
                        $("#waiting-task-modal #waiting-task-detail-file").html(data.tap_tin.slice(data.tap_tin.lastIndexOf('/') + 1 ));
                    }
                    if(data.tap_tin_nop != null) {
                        $("#waiting-task-modal #waiting-submit-task-file").attr("href", data.tap_tin_nop);
                        $("#waiting-task-modal #waiting-submit-task-file").html(data.tap_tin_nop.slice(data.tap_tin_nop.lastIndexOf('/') + 1 ));
                    }

                    $("#reject-task").attr("value", id);
                    $("#approve-task").attr("value", id);
                }
            });
        });
    });

    // Xem chi tiết rejected task
    let rejectedTaskDetailBtns = document.querySelectorAll('.rejected-column .detail-btn');
    Array.from(rejectedTaskDetailBtns).forEach((btn) => {
        $(btn).click(e => {
            let rejectedTaskDetailInfo;
            let id = $(btn).children().val();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: { 'task_id': id },
                url: "/task/getTaskDetail",
                success: function(data) {
                    rejectedTaskDetailInfo = data;
                    $(document.querySelector('#rejected-task-index-modal .modal-title')).html(data.ten_task);
                    $(document.querySelector('#rejected-task-index-modal .task-detail-phongban')).html(data.ten_phong);

                    let thoi_gian_deadline_date = new Date(data.thoi_gian_deadline);
                    let dateString = moment(data.thoi_gian_deadline).format('DD/MM/YYYY');
                    let timeString = moment(data.thoi_gian_deadline).format('HH:mm');


                    $(document.querySelector('#rejected-task-index-modal .task-detail-date')).html(dateString);
                    $(document.querySelector('#rejected-task-index-modal .task-detail-time')).html(timeString);
                    $(document.querySelector('#rejected-task-index-modal .time-submit-manage')).html(timeString + ", "+ dateString);

                    if (new Date() < thoi_gian_deadline_date) {
                        let timeRemainingString = data.days + "d " + data.hours + "h " + data.minutes + 'm';
                        $(document.querySelector('#rejected-task-index-modal .task-time-remaining')).html(timeRemainingString);
                    }
                    else {
                        $(document.querySelector('#rejected-task-index-modal .task-time-remaining')).html("Quá hạn");
                    }
                    $(document.querySelector('#rejected-task-index-modal #new-deadline-input')).val(moment(data.thoi_gian_deadline).format('YYYY-MM-DDTHH:mm'));
                    $(document.querySelector('#rejected-task-index-modal .task-member')).html(data.ho_ten);
                    $(document.querySelector('#rejected-task-index-modal .task-desc-input')).html(data.task_mo_ta);
                    $(document.querySelector('#rejected-task-index-modal #rejected-submit-task-input')).html(data.mo_ta_nop);
                    if(data.tap_tin != null) {
                        $("#rejected-task-index-modal #rejected-task-detail-file").attr("href", data.tap_tin);
                        $("#rejected-task-index-modal #rejected-task-detail-file").html(data.tap_tin.slice(data.tap_tin.lastIndexOf('/') + 1 ));
                    }
                    if(data.tap_tin_nop != null) {
                        $("#rejected-task-index-modal #rejected-submit-task-file").attr("href", data.tap_tin_nop);
                        $("#rejected-task-index-modal #rejected-submit-task-file").html(data.tap_tin_nop.slice(data.tap_tin_nop.lastIndexOf('/') + 1 ));
                    }

                    $("#reject-task").attr("value", id);
                    $("#approve-task").attr("value", id);
                }
            });
        });
    });

    // Xem chi tiết completed task
    let completedTaskDetailBtns = document.querySelectorAll('.completed-column .detail-btn');
    Array.from(completedTaskDetailBtns).forEach((btn) => {
        $(btn).click(e => {
            let completedTaskDetailInfo;
            let id = $(btn).children().val();
            $.ajax({
                type: "POST",
                dataType: "json",
                data: { 'task_id': id },
                url: "/task/getTaskDetail",
                success: function(data) {
                    rejectedTaskDetailInfo = data;
                    $(document.querySelector('#completed-task-modal .modal-title')).html(data.ten_task);
                    $(document.querySelector('#completed-task-modal .task-detail-phongban')).html(data.ten_phong);

                    let thoi_gian_deadline_date = new Date(data.thoi_gian_deadline);
                    let dateString = moment(data.thoi_gian_deadline).format('DD/MM/YYYY');
                    let timeString = moment(data.thoi_gian_deadline).format('HH:mm');

                    $(document.querySelector('#completed-task-modal .task-detail-date')).html(dateString);
                    $(document.querySelector('#completed-task-modal .task-detail-time')).html(timeString);
                    $(document.querySelector('#completed-task-modal .time-submit-manage')).html(timeString + ", "+ dateString);

                    if (new Date() < thoi_gian_deadline_date) {
                        let timeRemainingString = data.days + "d " + data.hours + "h " + data.minutes + 'm';
                        $(document.querySelector('#completed-task-modal .task-time-remaining')).html(timeRemainingString);
                    }
                    else {
                        $(document.querySelector('#completed-task-modal .task-time-remaining')).html("Quá hạn");
                    }
                    $(document.querySelector('#completed-task-modal #new-deadline-input')).val(moment(data.thoi_gian_deadline).format('YYYY-MM-DDTHH:mm'));
                    $(document.querySelector('#completed-task-modal .task-member')).html(data.ho_ten);
                    $(document.querySelector('#completed-task-modal .task-desc-input')).html(data.task_mo_ta);
                    $(document.querySelector('#completed-task-modal #completed-submit-task-input')).html(data.mo_ta_nop);
                    
                    let ranking;
                    if(data.muc_do_hoan_thanh == 1){
                        ranking = "BAD";
                        $("#completed-ranking").html(ranking).addClass("bad");
                    }else if(data.muc_do_hoan_thanh == 2){
                        ranking = "OK";
                        $("#completed-ranking").html(ranking).addClass("ok");
                    }else{
                        ranking = "GOOD";
                        $("#completed-ranking").html(ranking).addClass("good");
                    }

                    if(data.tap_tin != null) {
                        $("#completed-task-modal #completed-task-detail-file").attr("href", data.tap_tin);
                        $("#completed-task-modal #completed-task-detail-file").html(data.tap_tin.slice(data.tap_tin.lastIndexOf('/') + 1 ));
                    }
                    if(data.tap_tin_nop != null) {
                        $("#completed-task-modal #completed-submit-task-file").attr("href", data.tap_tin_nop);
                        $("#completed-task-modal #completed-submit-task-file").html(data.tap_tin_nop.slice(data.tap_tin_nop.lastIndexOf('/') + 1 ));
                    }
                }
            });
        });
    });

    // Bắt đầu task  
    let startTaskBtns = document.querySelectorAll('.new-column .start-task');
    Array.from(startTaskBtns).forEach((btn) => {
        $(btn).click(e => {
            let id = $(btn).children().val();
            var form = new FormData();
            form.append('task_id', id);

            var settings = {
                "url": "/task/taskStart",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form,
                complete: function(e, xhr, settings) {
                    if (e.status === 200) {
                        if (e.responseText == "Success") {
                            window.location.replace(`${window.location.pathname}`)
                        } else {
                            // $('#phimDeleteModal .modal-body').html(e.responseText);
                        };
                    } else {
                        // $('#phimDeleteModal .modal-body').html(e.responseText);
                    }
                }
            }
            $.ajax(settings);
        });
    });
    
    // Hủy task  
    let cancelTaskBtns = document.querySelectorAll('.new-column .cancel-task');
    Array.from(cancelTaskBtns).forEach((btn) => {
        $(btn).click(e => {
            let id = $(btn).children().val();

            $('#cancelTask .cancel-modal-accept__btn').click(e => {
                var form = new FormData();
                form.append('task_id', id);

                var settings = {
                    "url": "/task/taskCancel",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    complete: function(e, xhr, settings) {
                        if (e.status === 200) {
                            if (e.responseText == "Success") {
                                window.location.replace(`${window.location.pathname}`)
                            } else {
                                // $('#phimDeleteModal .modal-body').html(e.responseText);
                            };
                        } else {
                            // $('#phimDeleteModal .modal-body').html(e.responseText);
                        }
                    }
                }
                $.ajax(settings);
            });
        });
    });

    // Nhận lại task
    let assignBackBtns = document.querySelectorAll('.rejected-column .asign-again-btn');
    Array.from(assignBackBtns).forEach((btn) => {
        $(btn).click(e => {
            let id = $(btn).val();

            var form = new FormData();
            form.append('task_id', id);
    
            var settings = {
                "url": "task/taskAsignBack",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form,
                complete: function(e, xhr, settings) {
                    if (e.status === 200) {
                        if (e.responseText == "Success") {
                            window.location.replace(`${window.location.pathname}`)
                        }
                    }
                }
            }
            $.ajax(settings); 
        });
    });

    // Update new task
    $('#new-task-manage-form').on('submit', function(e) {
        e.preventDefault();
        $("#message_submit_task").css("display", "none");

        let form = new FormData(document.getElementById('new-task-manage-form'));
        let id = $("#update-task-btn").attr("value");

        form.append('mo_ta', $('#task-desc-input-update').val());
        form.append('task_id', id);
        form.append('thoi_gian_deadline', $('#task-deadline-update').val());

        var settings = {
            "url": "/task/taskUpdate",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText == "Success") {
                        window.location.replace(`${window.location.pathname}`)
                    } else {
                        $("#message_submit_task").css("display", "block");
                        $("#message_submit_task").html(e.responseText);
                    };
                } else {
                    $("#message_submit_task").css("display", "block");
                    $("#message_submit_task").html(e.responseText);
                }
            }
        }
        $.ajax(settings);
    });

    // Submit in progress task
    $('#submit-task-main-form').on('submit', function(e) {
        e.preventDefault();
        $("#message_submit_task").css("display", "none");

        let form = new FormData(document.getElementById('submit-task-main-form'));
        let id = $('.submit-task').children().val();


        form.append('mo_ta_nop', $('#task-submit-desc').val());
        form.append('task_id', id);

        var settings = {
            "url": "/task/taskSubmit",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText == "Success") {
                        window.location.replace(`${window.location.pathname}`)
                    } else {
                        $("#message_submit_task").css("display", "block");
                        $("#message_submit_task").html(e.responseText);
                    };
                } else {
                    $("#message_submit_task").css("display", "block");
                    $("#message_submit_task").html(e.responseText);
                }
            }
        }
        $.ajax(settings);
    });

    // Duyệt task
    $("#approve-confirm-btn").on('click', function(e) {
        e.preventDefault();
        $("#message_waiting_task").css("display", "none");

        let form = new FormData();
        let id = $('#approve-task').attr("value");
        
        form.append('task_id', id);
        form.append('muc_do_hoan_thanh', $("#task-detail-rank").val());

        var settings = {
            "url": "/task/taskApprove",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText == "Success") {
                        window.location.replace(`${window.location.pathname}?status=created`)
                    } else {
                        $("#message_waiting_task").css("display", "block");
                        $("#message_waiting_task").html(e.responseText);
                    };
                } else {
                    $("#message_waiting_task").css("display", "block");
                    $("#message_waiting_task").html(e.responseText);
                }
            }
        }
        $.ajax(settings);
        
    });

    //Không duyệt task
    $('#task-rejected-form').on('submit', function(e) {
        e.preventDefault();
        $("#message_confirm_reject_task").css("display", "none");
        
        let form = new FormData(document.getElementById('task-rejected-form'));
        form.append('task_id', $('#reject-task').attr("value"));
        form.append('feedback', $("#rejected-feedback-input").val());
        form.append('thoi_gian_deadline', $('#task-deadline-extend').val());

        var settings = {
            "url": "/task/taskReject",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText == "Success") {
                        window.location.replace(`${window.location.pathname}?status=created`)
                    } else {
                        $("#message_confirm_reject_task").css("display", "block");
                        $("#message_confirm_reject_task").html(e.responseText);
                    };
                } else {
                    $("#message_confirm_reject_task").css("display", "block");
                    $("#message_confirm_reject_task").html(e.responseText);
                }
            }
        }
        $.ajax(settings);
        
    });

    // *******************************************************
    // ********** view/User/UserProfile.php
    // *******************************************************

    //thay avatar
    $('#profile-avatar-file').change(e => {
        let image = $("#profile-avatar-img");
        image.attr('src', URL.createObjectURL(e.target.files[0]));
    });

    // Handle chỉnh sửa hình ảnh
    $('#profile-avatar-file').on('change', function(e) {
        // e.preventDefault();
        // $("#message_submit_task").css("display", "none");

        let form = new FormData(document.getElementById('profile-avatar'));

        var settings = {
            "url": "/users/updateAvatar",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText == "Success") {
                        window.location.replace(`${window.location.pathname}`)
                    } else {
                        // $("#message_submit_task").css("display", "block");
                        // $("#message_submit_task").html(e.responseText);
                    };
                } else {
                    // $("#message_submit_task").css("display", "block");
                    // $("#message_submit_task").html(e.responseText);
                }
            }
        }
        $.ajax(settings);
    });

    // *******************************************************
    // ********** view/Department/DepartmentManagement.php
    // *******************************************************

    //Handle tạo phòng ban mới
    $('#department-create-form').on('submit', function(e) {
        e.preventDefault();
        $("message_create_department").css("display", "none");
        
        var form = new FormData();
        form.append('ten_phong', $('#department-name-input').val());
        form.append('mo_ta', $('#department-desc-input').val());

        var settings = {
            "url": "/api/Department/DepartmentCreate.api.php",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText == "Success") {
                        window.location.replace(`${window.location.pathname}?status=created`);
                    } else {
                        $("#message_create_department").css("display", "block");
                        $("#message_create_department").html(e.responseText);
                    };
                } else {
                    $("#message_create_department").css("display", "block");
                    $("#message_create_department").html(e.responseText);
                }
            }
        }
        $.ajax(settings);
    });

    // Handle chỉnh sửa phòng ban
    let departmentUpdateBtns = document.getElementsByClassName('department-modify-btn');
    Array.from(departmentUpdateBtns).forEach((btn) => {
        $(btn).click(e => {
            let departmentDetailInfo;
            let id = $(btn).val();
            $.ajax({
                type: "GET",
                dataType: "json",
                data: { 'phong-ban-id': id },
                url: "/api/Department/DepartmentGetDetail.api.php",
                success: function(data) {
                    departmentDetailInfo = data;
                    $('#department-name-update').val(data.ten_phong);
                    $('#department-desc-update').val(data.mo_ta);
                }
            });
            $('#department-update-form').on('submit', function(e) {
                e.preventDefault();
                $("#message_update_department").css("display", "none");
                
                var form = new FormData();
                form.append('phong_ban_id', id);
                form.append('ten_phong', $('#department-name-update').val());
                form.append('mo_ta', $('#department-desc-update').val());

                var settings = {
                    "url": "/api/Department/DepartmentUpdate.api.php",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    complete: function(e, xhr, settings) {
                        if (e.status === 200) {
                            if (e.responseText == "Success") {
                                window.location.replace(`/view/Department/DepartmentManagement.php`)
                            } else {
                                $("#message_update_department").css("display", "block");
                                $("#message_update_department").html(e.responseText);
                            };
                        } else {
                            $("#message_update_department").css("display", "block");
                            $("#message_update_department").html(e.responseText);
                        }
                    }
                }
                $.ajax(settings);
            });
        });
    });

    // Handle chỉnh sửa trưởng phòng
    $("#edit-manager-form").on('submit', function(e) {
        e.preventDefault();
        
        $("#message-edit-manager").css("display", "none");
        $(".alert-info").css("display", "none");

        var form = new FormData();
        if($("#user_id").val() != $("#user_id").attr("default"))
            form.append("user_id", $("#user_id").val());
        
        if(Array.from(form.values()).length == 0){
            $(".department-btn-mode").css("display", "none");
            return;
        }

        form.append("phong_ban_id", $("#save-manager-btn").attr("value"));

        var settings = {
            "url": "/api/Department/ManagerUpdate.api.php",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText.trim() == "Success"){
                        window.location.replace(`${window.location.pathname}?phong-ban-id=${$("#save-manager-btn").attr("value")}&status=updated`)
                    }else{
                        $("#message-edit-manager").html("Có lỗi đã xảy ra, vui lòng thử lại sau");
                        $("#message-edit-manager").css("display", "block");
                    }
                } else {
                    $("#message-edit-manager").html(e.responseText);
                    $("#message-edit-manager").css("display", "block");
                }
            }
        };

        $.ajax(settings);
    });

    // Function to handle go to edit truong phong
    $("#edit-manager-btn").click(function() {
        $(this).css("display","none");
        $("select").attr("disabled", false);
        $("#save-manager-btn").css("display", "inline-block");
    });
    
    // *******************************************************
    // ********** Login.php
    // *******************************************************

    $('#login_form').on('submit', function(e) {
        e.preventDefault();
        $("#message_signin").css("display", "none");
        $(".alert-info").css("display", "none");

        const form = new FormData(document.getElementById("login_form"));

        $.ajax({
            type: "POST",
            url: "/utils/login",
            timeout: 0,
            processData: false,
            contentType: false,
            data: form,
            success: function (xhr, e, settings) {
              try {
                  xhr = JSON.parse(xhr);
              } catch (error) {
                  xhr = xhr
              }

              if(xhr["message"] === "Password need to update") {
                $("#reset").css("display", "block");
                return;
              }
              if(xhr["message"] === "Sign in success" ) {
                window.location.replace(`/`);
              } 
              $("#message_signin").css("display", "block");
              $("#message_signin").html(xhr["message"]);
            },
            error: function (xhr, text, err) {
              $("#message_signin").css("display", "block");
              $("#message_signin").html(JSON.parse(xhr['responseText'])["message"]);
            },
        });
    });

    $('#reset_form').on('submit', function(e) {
        e.preventDefault();
        $("#message_signin_2").css("display", "none");

        if($("#new_password").val() != $("#confirm_new_password").val()){
            $("#message_signin_2").css("display", "block");
            $("#message_signin_2").html("Xác nhận mật khẩu mới không trùng khớp");
            return;
        }

        var form = new FormData();
        form.append("username", $("#username").val());
        form.append("new_password", $("#new_password").val());

        var settings = {
            "url": "/users/updatePassword",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText == "Success") {
                        window.location.replace(`/`);
                    } else {
                        $("#message_signin_2").css("display", "block");
                        $("#message_signin_2").html("Some thing went wrong, please try again later");
                    };
                } else {
                    $("#message_signin_2").css("display", "block");
                    $("#message_signin_2").html(e.responseText);
                }
            }
        };
        $.ajax(settings);
    });

    // *******************************************************
    // ********** view/User/UserManagement.php
    // *******************************************************
    // function to handle Telephone input
    $("#sdt").on('input', function(e) {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });


    function myFunction(p1, p2) {
        return p1 * p2;   // The function returns the product of p1 and p2
    }
    
    $('#user_create_form').on('submit', function(e) {
        e.preventDefault();
        $("#message_create_user").css("display", "none");
        $("#message_create_user_info").css("display", "none");

        var form = new FormData();
        form.append("ho_ten", $("#ho_ten").val());
        form.append("user_name", $("#user_name").val());
        form.append("ngay_sinh", $("#ngay_sinh").val());
        form.append("gioi_tinh", $("#gioi_tinh").val()); 
        form.append("phong_ban_id", $("#phong_ban_id").val()); 
        form.append("status", $("#status").val()); 
        form.append("sdt", $("#sdt").val());

        var settings = {
            "url": "/users/create",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText.trim() == "Success"){
                        $('#userCreateModal').modal('toggle');
                        window.location.replace(`${HOST}/users/management?status=created`);
                    }else{
                        $("#message_create_user").html("Có lỗi đã xảy ra, vui lòng thử lại sau");
                        $("#message_create_user").css("display", "block");
                    }
                } else {
                    $("#message_create_user").html(e.responseText);
                    $("#message_create_user").css("display", "block");
                }
            }
        };
        $.ajax(settings);
    });

    
    // *******************************************************
    // ********** view/User/UserDetail.php
    // *******************************************************

    // Function to go back to prev link
    $("#prev-link").click(function() {
        window.history.go(-1);
    });

    // Function to handle submit update User data
    $("#user_update_form").on('submit', function(e) {
        e.preventDefault();
        
        $("#message_update_user_danger").css("display", "none");
        $(".alert-info").css("display", "none");

        var form = new FormData();
        form.append("ho_ten", $("#ho_ten").val());
        form.append("ngay_sinh", $("#ngay_sinh").val());
        form.append("gioi_tinh", $("#gioi_tinh").val()); 
        form.append("status", $("#status").val()); 
        form.append("sdt", $("#sdt").val());
        
        if(Array.from(form.values()).length == 0){
            $("#edit-mode-btn").css("display","block");
            $("input").attr("readonly", true);
            $("select").attr("disabled", true);
            $(".btn-mode").css("display", "none");
    
            $("input").each(function(){
                let tmp = $(this).attr("default");
                $(this).val(tmp);
            });
            return;
        }

        form.append("user_id", $("#edit-mode-btn").attr("value"));

        var settings = {
            "url": "/users/updateUser",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText.trim() == "Success"){
                        window.location.replace(`${window.location.pathname}?user_id=${$("#edit-mode-btn").attr("value")}&status=updated`)
                    }else{
                        $("#message_update_user_danger").html("Có lỗi đã xảy ra, vui lòng thử lại sau");
                        $("#message_update_user_danger").css("display", "block");
                    }
                } else {
                    $("#message_update_user_danger").html(e.responseText);
                    $("#message_update_user_danger").css("display", "block");
                }
            }
        };

        $.ajax(settings);
    });
    
    // Function to handle go to edit mode
    $("#edit-mode-btn").click(function() {
        $(this).css("display","none");
        $("#reset-mode-btn").css("display", "none");
        $("input").attr("readonly", false);
        $("select").attr("disabled", false);        
        $("#phong_ban_id").attr("disabled", true);
        $("#user_name").attr("readonly", true);
        $(".btn-mode").css("display", "block");
    });

    // Function to handle back to normal mode
    $("#btn-cancel").click(function(e) {
        e.preventDefault();
        $("#edit-mode-btn").css("display","block");
        $("#reset-mode-btn").css("display", "block");
        $("input").attr("readonly", true);
        $("select").attr("disabled", true);
        $(".btn-mode").css("display", "none");

        $("input").each(function(){
            let tmp = $(this).attr("default");
            $(this).val(tmp);
        });
    });

    // Function for css progress bar
    $(function() {
        $(".progress").each(function() {
      
          var value = $(this).attr('data-value');
          var left = $(this).find('.progress-left .progress-bar');
          var right = $(this).find('.progress-right .progress-bar');
      
          if (value > 0) {
            if (value <= 50) {
              right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
            } else {
              right.css('transform', 'rotate(180deg)')
              left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
            }
          }
      
        })
      
        function percentageToDegrees(percentage) {
          return percentage / 100 * 360
        }
    });

    // Function to handle reset default password for user
    $("#btn-reset-user-pass").click(function() {        
        $("#message_update_user_danger").css("display", "none");
        $(".alert-info").css("display", "none");

        var form = new FormData();
        form.append("user_name", $("#user_name").val());

        var settings = {
            "url": "/users/resetDefaultPassword",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText.trim() == "Success"){
                        $('#userResetModal').modal('toggle');
                        $("#message_update_user_infor").html("Đặt lại mật khẩu thành công");
                        $("#message_update_user_infor").css("display", "block");
                    }else{
                        $("#message_update_user_danger").html("Có lỗi đã xảy ra, vui lòng thử lại sau");
                        $("#message_update_user_danger").css("display", "block");
                    }
                } else {
                    $("#message_update_user_danger").html(e.responseText);
                    $("#message_update_user_danger").css("display", "block");
                }
                $('#userResetModal').modal('toggle');
            }
        };

        $.ajax(settings);
    });

    // *******************************************************
    // ********** view/User/CurrentUserDetail.php
    // *******************************************************

    // Function to handle change password for user
    $("#btn-update-user-pass").click(function() {        
        $("#message_update_user_danger").css("display", "none");
        $(".alert-info").css("display", "none");

        if($("#new_password").val() != $("#confirm_new_password").val()){
            $("#message_update_user_danger").css("display", "block");
            $("#message_update_user_danger").html("Xác nhận mật khẩu mới không trùng khớp với mật khẩu mới");
            return;
        }

        var form = new FormData();
        form.append("curr_password", $("#curr_password").val());
        form.append("new_password", $("#new_password").val());

        var settings = {
            "url": "/users/userUpdatePassword",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText.trim() == "Success"){
                        $('#userResetModal').modal('toggle');
                        $("#message_update_user_infor").html("Thay đổi mật khẩu thành công");
                        $("#message_update_user_infor").css("display", "block");
                        $('#userResetModal').modal('toggle');
                    }else{
                        $("#message_update_user_danger").html("Có lỗi đã xảy ra, vui lòng thử lại sau");
                        $("#message_update_user_danger").css("display", "block");
                    }
                } else {
                    $("#message_update_user_danger").html(e.responseText);
                    $("#message_update_user_danger").css("display", "block");
                }
            }
        };

        $.ajax(settings);
    });

    // *******************************************************
    // ********** view/Absence/AbsenceIndex.php
    // *******************************************************
    // Function to handle submit update User data
    $("#form_create_absence").on('submit', function(e) {
        e.preventDefault();
        
        $("#message_create_absence").css("display", "none");
        $(".alert-info").css("display", "none");

        var form = new FormData(document.getElementById('form_create_absence'));
        form.append("ngay_bat_dau", $("#ngay_bat_dau").val());
        form.append("ngay_ket_thuc", $("#ngay_ket_thuc").val());
        form.append("ly_do", $("#ly_do").val());

        var settings = {
            "url": "/absence/create",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText.trim() == "Success"){
                        window.location.replace(`${window.location.pathname}?status=created`)
                    }else{
                        $("#message_create_absence").html("Có lỗi đã xảy ra, vui lòng thử lại sau");
                        $("#message_create_absence").css("display", "block");
                    }
                } else {
                    $("#message_create_absence").html(e.responseText);
                    $("#message_create_absence").css("display", "block");
                }
            }
        };

        $.ajax(settings);
    });

    // Handle view detail of an absence
    $("#absence_view_detail_btn").click(function(){
        $("#absence-creator").html($(this).attr('asignee'));
        $("#absence-start-day").html($(this).attr('start'));
        $("#absence-end-day").html($(this).attr('end'));
        $("#absence-reason").html($(this).attr('reason'));
        let file_path = $(this).attr('file');
        $("#absence-detail-file").attr("href", file_path);
        $("#absence-detail-file").html(file_path.slice(file_path.lastIndexOf('/') + 1 ));
    })

    // *******************************************************
    // ********** view/Absence/AbsenceManagement.php
    // *******************************************************

    $("#view_detail_btn").click(function(){
        $("#absence-creator").html($(this).attr('asignee'));
        $("#absence-start-day").html($(this).attr('start'));
        $("#absence-end-day").html($(this).attr('end'));
        $("#absence-reason").html($(this).attr('reason'));
        
        let file_path = $(this).attr('file');
        $("#absence-detail-file").attr("href", file_path);
        $("#absence-detail-file").html(file_path.slice(file_path.lastIndexOf('/') + 1 ));

        $("#btn_aprrove").attr('abs_id',$(this).attr('abs_id'));
        $("#btn_reject").attr('abs_id',$(this).attr('abs_id'));
    })

    $("#btn_aprrove").click(function(){        
        var form = new FormData();
        form.append("absence_id", $(this).attr('abs_id'));
        form.append("status", 1);

        var settings = {
            "url": "/absence/absenceProcessing",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText.trim() == "Success"){
                        window.location.replace(`${window.location.pathname}?status=approved`)
                    }else{
                        $("#message_absence_process_danger").html("Có lỗi đã xảy ra, vui lòng thử lại sau");
                        $("#message_absence_process_danger").css("display", "block");
                    }
                } else {
                    $("#message_absence_process_danger").html(e.responseText);
                    $("#message_absence_process_danger").css("display", "block");
                }
            }
        };

        $.ajax(settings);
    })

    $("#btn_reject").click(function(){        
        var form = new FormData();
        form.append("absence_id", $(this).attr('abs_id'));
        form.append("status", -1);

        var settings = {
            "url": "absence/absenceProcessing",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            complete: function(e, xhr, settings) {
                if (e.status === 200) {
                    if (e.responseText.trim() == "Success"){
                        window.location.replace(`${window.location.pathname}?status=rejected`)
                    }else{
                        $("#message_create_absence").html("Có lỗi đã xảy ra, vui lòng thử lại sau");
                        $("#message_create_absence").css("display", "block");
                    }
                } else {
                    $("#message_create_absence").html(e.responseText);
                    $("#message_create_absence").css("display", "block");
                }
            }
        };

        $.ajax(settings);
    })
}); 

// *******************************************************
// ********** view/User/UserManagement.php
// *******************************************************

let selectedUser = null;

// Function to set selected user
function _setSelectedUser(user_name){
    selectedUser = user_name;
    $("#userDeleteModal .modal-body").html(`Bạn có chắc là muốn vô hiệu hóa <b>${selectedUser}</b> chứ?`)
}

function _deleteUser(){
    $("#message_create_user").css("display", "none");
    $("#message_create_user_info").css("display", "none");

    var form = new FormData();
    form.append("user_name", selectedUser);

    var settings = {
        "url": "/users/disableUser",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form,
        complete: function(e, xhr, settings) {
            if (e.status === 200) {
                if (e.responseText.trim() == "Success"){
                    $('#userCreateModal').modal('toggle');
                    window.location.replace(`${HOST}/users/management?status=deleted`);
                }else{
                    $("#message_create_user").html("Có lỗi đã xảy ra, vui lòng thử lại sau");
                    $("#message_create_user").css("display", "block");
                }
            } else {
                $("#message_create_user").html(e.responseText);
                $("#message_create_user").css("display", "block");
            }
        }
    };
    $.ajax(settings);
}

// *******************************************************
// ********** view/Task/TaskManagement.php
// *******************************************************

function updateRejectedHistory(id){
    var settings = {
        "url": `/task/getTaskHistory?task_id=${id}`,
        "method": "GET",
        "timeout": 0,
        complete: function(e, xhr, settings) {
   
            let list_history =  JSON.parse(e.responseText);
            let htmlStr = ` <div>
                                <i class="fas fa-history"></i>
                                <h3>Lịch sử công việc</h3>
                            </div>
                            <div class="history-task-bar">
                            `;
            for(let i in list_history){
                let tmp = list_history[i];
                
                let history_status;
                if(tmp['task_status'] == 1){
                    history_status = "Duyệt";
                }else{
                    history_status = "Từ chối";
                }

                htmlStr += `
                    <div class="history-section" onclick="_showHistoryTask(${tmp['history_id']})">
                        <h3><b>${history_status}</b></h3>
                        <h3>${tmp['created_on']}</h3>
                        <div class="history-desc">${tmp['note'] ? tmp['note'] : "" }</div>
                    </div>
                `;
            }
            htmlStr += `</div>`;
            $(".task-detail-history").html(htmlStr);
        }
    }

    $.ajax(settings);
}

function _showHistoryTask(id) {

    var settings = {
        "url": `/task/getTaskHistoryDetail?history_id=${id}`,
        "method": "GET",
        "timeout": 0,
        complete: function(e, xhr, settings) {
            $(".reject-part-section").css("display","none");
            let list_history =  JSON.parse(e.responseText);
            let htmlStr = ` <div>
                            <i class="fas fa-history"></i>
                            <h3>Lịch sử công việc</h3>
                        </div>`;
            for(let i in list_history){
                let tmp = list_history[i];
                
                let history_status;
                if(tmp['task_status'] == 1){
                    history_status = "Duyệt";
                }else{
                    $(".reject-part-section").css("display","block");
                    history_status = "Từ chối";
                }
                
                htmlStr = `
                    <div class="history-section" onclick="_showHistoryTask(${tmp['history_id']})">
                        <h3><b>${history_status}</b></h3>
                        <h3>${tmp['created_on']}</h3>
                        <div class="history-desc">${tmp['note']}</div>
                    </div>
                `;
                
                $("#history-desc-text").html(tmp['mo_ta_nop']);
                $("#history-feedback-text").html(tmp['note']);
                // Manager file
                if(tmp['file_history'] != null){
                    $("#history-submit-task-file").attr("href", tmp['file_history']);
                    $("#history-submit-task-file").html(tmp['file_history'].slice(tmp['file_history'].lastIndexOf('/') + 1 ));
                }
                // User file
                if(tmp['file_task_nop'] != null){
                    $("#asignee-submit-task-file").attr("href", tmp['file_task_nop']);
                    $("#asignee-submit-task-file").html(tmp['file_task_nop'].slice(tmp['file_task_nop'].lastIndexOf('/') + 1 ));
                }
            }

            let historyModal = document.getElementById('task-history-overlay')
            historyModal.classList.add('history-task-active')
        }
    }

    $.ajax(settings);


}

function _hideHistoryTask() {
    let historyModal = document.getElementById('task-history-overlay')
    historyModal.classList.remove('history-task-active')
}