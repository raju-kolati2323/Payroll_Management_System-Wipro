package com.example.payroll.model;

import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "leaves")
public class Leave {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long leaveId;

	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "employee_id", nullable = false)
	    private Employee employee;

	    @NotNull(message = "Leave start date cannot be null")
	    @Temporal(TemporalType.DATE)
	    private Date startDate;

	    @Temporal(TemporalType.DATE)
	    private Date endDate;  // Optional

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private LeaveType leaveType;

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private LeaveStatus status;
	    
	public Long getLeaveId() {
			return leaveId;
		}

		public void setLeaveId(Long leaveId) {
			this.leaveId = leaveId;
		}

		public Employee getEmployee() {
			return employee;
		}

		public void setEmployee(Employee employee) {
			this.employee = employee;
		}

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

		public LeaveStatus getStatus() {
			return status;
		}

		public void setStatus(LeaveStatus status) {
			this.status = status;
		}

		 public long getLeaveDurationDays() {
		        if (endDate == null) {
		            return 1;
		        }
		        long days = ChronoUnit.DAYS.between(
		            startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
		            endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		        ) + 1;
		        return days > 0 ? days : 1;
		    }
}
