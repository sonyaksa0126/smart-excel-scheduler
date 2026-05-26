import React, { useRef, useEffect } from 'react';
import { getMonthDaysGrid, getKoreanHoliday } from '../utils/dateUtils';
import { Trash2, Plus, Check } from 'lucide-react';

// Self-expanding, auto-resizing textarea to allow clean word-wrapping and dynamic row-height stretching
const AutoResizingTextarea = ({ value, onChange, placeholder, className, ...props }) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      rows={1}
      {...props}
    />
  );
};

function ExcelScheduler({
  currentYear,
  currentMonth,
  tasks,
  onAddTask,
  onUpdateTaskText,
  onCycleTaskStatus,
  onDeleteTask,
  weeklyMemos,
  onUpdateWeeklyMemo,
  todayStr
}) {
  // Generate the monthly 35 or 42 grid cells
  const daysGrid = getMonthDaysGrid(currentYear, currentMonth);

  // Group cells into 7-day weeks (rows)
  const weeks = [];
  for (let i = 0; i < daysGrid.length; i += 7) {
    weeks.push(daysGrid.slice(i, i + 7));
  }

  const totalWeeks = weeks.length;
  const isSixWeeks = totalWeeks === 6;

  return (
    <div className="excel-table-container">
      <table className="excel-table">
        {/* Table Header: 8 columns (Sunday ~ Saturday + Weekly Memo) */}
        <thead>
          <tr>
            <th className="excel-th sun" style={{ width: '12%' }}>일 (SUN)</th>
            <th className="excel-th weekday" style={{ width: '12%' }}>월 (MON)</th>
            <th className="excel-th weekday" style={{ width: '12%' }}>화 (TUE)</th>
            <th className="excel-th weekday" style={{ width: '12%' }}>수 (WED)</th>
            <th className="excel-th weekday" style={{ width: '12%' }}>목 (THU)</th>
            <th className="excel-th weekday" style={{ width: '12%' }}>금 (FRI)</th>
            <th className="excel-th sat" style={{ width: '12%' }}>토 (SAT)</th>
            <th className="excel-th memo" style={{ width: '16%' }}>주간 메모 (MEMO)</th>
          </tr>
        </thead>
        
        {/* Table Body: 5 or 6 Week Rows */}
        <tbody>
          {weeks.map((weekDays, weekIndex) => {
            const weekKey = `${currentYear}-${currentMonth + 1}-w${weekIndex + 1}`;
            
            return (
              <tr 
                key={weekIndex} 
                className={`excel-row ${isSixWeeks ? 'six-weeks' : ''}`}
              >
                {/* 7 Columns: Sunday to Saturday */}
                {weekDays.map((dayCell, colIndex) => {
                  const isToday = dayCell.dateString === todayStr;
                  const isSelectedMonth = dayCell.isCurrentMonth;
                  const holidayName = getKoreanHoliday(dayCell.dateString);
                  const isHoliday = holidayName !== null;

                  // Map column index to specific classes
                  let dayTypeClass = 'weekday';
                  if (colIndex === 0) dayTypeClass = 'sun';
                  if (colIndex === 6) dayTypeClass = 'sat';

                  // Get day's task list
                  const dayTasks = tasks[dayCell.dateString] || [];

                  return (
                    <td
                      key={dayCell.dateString}
                      className={`excel-td ${dayTypeClass} ${
                        !isSelectedMonth ? 'outside-month' : ''
                      } ${isToday ? 'today' : ''} ${isHoliday ? 'holiday' : ''}`}
                    >
                      <div className="cell-wrapper">
                        {/* Day Cell Header: Date Number, Holiday text, and Today Badge */}
                        <div className="cell-header">
                          <span className="cell-date-num">{dayCell.day}</span>
                          {isHoliday && <span className="cell-holiday-label">{holidayName}</span>}
                          {isToday && <span className="today-badge">오늘</span>}
                        </div>

                        {/* List of dynamic, wrapping todo items */}
                        <div className="task-items-list">
                          {dayTasks.map(task => {
                            const isCompleted = task.status === 'completed';
                            const isInProgress = task.status === 'in-progress';
                            
                            return (
                              <div 
                                key={task.id} 
                                className={`todo-item-row ${task.status}`}
                              >
                                {/* 3-Stage Check Area Button */}
                                <button
                                  type="button"
                                  className="status-indicator-btn"
                                  onClick={() => onCycleTaskStatus(dayCell.dateString, task.id)}
                                  title="진행 상태 토글"
                                >
                                  <div className={`status-circle ${task.status}`}>
                                    {isCompleted && (
                                      <Check size={11} strokeWidth={3.5} />
                                    )}
                                  </div>
                                </button>

                                {/* Auto-Expanding Multi-line Input for Todo Text */}
                                <AutoResizingTextarea
                                  className="todo-textarea"
                                  value={task.text}
                                  onChange={(e) => onUpdateTaskText(dayCell.dateString, task.id, e.target.value)}
                                  placeholder="할 일 입력..."
                                />

                                {/* Individual Delete Trigger */}
                                <button
                                  type="button"
                                  className="delete-todo-btn"
                                  onClick={() => onDeleteTask(dayCell.dateString, task.id)}
                                  title="할 일 삭제"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            );
                          })}

                          {/* Capsule-shaped "+ 추가" button */}
                          <button
                            type="button"
                            className="add-todo-btn"
                            onClick={() => onAddTask(dayCell.dateString)}
                            title="할 일 추가"
                          >
                            <Plus size={12} /> 추가
                          </button>
                        </div>
                      </div>
                    </td>
                  );
                })}

                {/* 8th Column: Weekly Memo (Slate Gray head, Parchment bg card) */}
                <td className="excel-td memo-cell">
                  <div className="memo-wrapper">
                    <span className="memo-header-label">
                      {weekIndex + 1}주차 주간 메모
                    </span>
                    <textarea
                      className="memo-textarea"
                      value={weeklyMemos[weekKey] || ''}
                      onChange={(e) => onUpdateWeeklyMemo(weekKey, e.target.value)}
                      placeholder="이번 주 주요 추진 일정 및 업무 메모를 자유롭게 남기세요..."
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ExcelScheduler;
