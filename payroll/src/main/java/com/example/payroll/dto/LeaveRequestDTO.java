package com.example.payroll.dto;

import java.util.Date;

import com.example.payroll.model.LeaveType;

public class LeaveRequestDTO {

    private Date startDate;
    private Date endDate;
    private LeaveType leaveType;

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }
}

