import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { getMonthDaysGrid, getKoreanHoliday } from '../utils/dateUtils';
import { Trash2, Plus, Check } from 'lucide-react';

// Self-expanding, auto-resizing textarea to allow clean word-wrapping and dynamic row-height stretching
const AutoResizingTextarea = forwardRef(({ value, onChange, placeholder, className, ...props }, ref) => {
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

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Move selection to the very end of the text
        const length = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }
  }));

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
});

AutoResizingTextarea.displayName = 'AutoResizingTextarea';

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
  // Track which task needs to be focused
  const [focusedTaskId, setFocusedTaskId] = useState(null);
  
  // Refs map for all task textareas
  const textareaRefs = useRef({});

  // Trigger focus when focusedTaskId changes and exists in refs map
  useEffect(() => {
    if (focusedTaskId && textareaRefs.current[focusedTaskId]) {
      textareaRefs.current[focusedTaskId].focus();
      setFocusedTaskId(null); // Clear once focused
    }
  }, [focusedTaskId, tasks]);

  // Generate the monthly 35 or 42 grid cells
  const daysGrid = getMonthDaysGrid(currentYear, currentMonth);

  // Group cells into 7-day weeks (rows)
  const weeks = [];
  for (let i = 0; i < daysGrid.length; i += 7) {
    weeks.push(daysGrid.slice(i, i + 7));
  }

  const totalWeeks = weeks.length;
  const isSixWeeks = totalWeeks === 6;

  const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

  // Handle Notion-like keyboard interactions
  const handleTextareaKeyDown = (e, dateString, currentTask) => {
    // 1. Enter key: Add new blank task immediately after this one and focus it
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent standard newline character insertion
      
      const newId = 'task-enter-' + Date.now().toString() + Math.random().toString(36).substr(2, 4);
      setFocusedTaskId(newId);
      onAddTask(dateString, currentTask.id, newId);
    }
    
    // 2. Backspace key: Delete the task if empty, focus previous task
    if (e.key === 'Backspace' && currentTask.text === '') {
      e.preventDefault(); // Prevent delete character key default
      
      const dayTasks = tasks[dateString] || [];
      const currentIndex = dayTasks.findIndex(t => t.id === currentTask.id);
      if (currentIndex > 0) {
        const prevTask = dayTasks[currentIndex - 1];
        setFocusedTaskId(prevTask.id);
      } else {
        setFocusedTaskId(null);
      }
      
      onDeleteTask(dateString, currentTask.id);
    }
  };

  const handleAddClick = (dateString) => {
    const newId = 'task-add-' + Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setFocusedTaskId(newId);
    onAddTask(dateString, null, newId);
  };

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
                          <span className="cell-date-num">
                            {dayCell.day}
                            <span className="mobile-weekday-label">({WEEKDAY_NAMES[colIndex]})</span>
                          </span>
                          {isHoliday && <span className="cell-holiday-label">{holidayName}</span>}
                          {isToday && <span className="today-badge">오늘</span>}
                        </div>

                        {/* List of dynamic, wrapping todo items */}
                        <div className="task-items-list">
                          {dayTasks.map(task => {
                            const isCompleted = task.status === 'completed';
                            
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
                                  ref={el => {
                                    if (el) {
                                      textareaRefs.current[task.id] = el;
                                    } else {
                                      delete textareaRefs.current[task.id];
                                    }
                                  }}
                                  className="todo-textarea"
                                  value={task.text}
                                  onChange={(e) => onUpdateTaskText(dayCell.dateString, task.id, e.target.value)}
                                  onKeyDown={(e) => handleTextareaKeyDown(e, dayCell.dateString, task)}
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
                            onClick={() => handleAddClick(dayCell.dateString)}
                            title="할 일 추가"
                          >
                            <Plus size={12} /> 추가
                          </button>
                        </div>
                      </div>
                    </td>
                  );
                })}

                {/* 8th Column: Weekly Memo */}
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
