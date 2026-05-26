import React, { useState, useEffect } from 'react';
import ExcelScheduler from './components/ExcelScheduler';
import DailyBriefing from './components/DailyBriefing';
import { formatDateString } from './utils/dateUtils';
import { Pencil, Sparkles } from 'lucide-react';

function App() {
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  // Navigation Year and Month state
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // Today's formatted date string YYYY-MM-DD
  const todayStr = formatDateString(new Date());

  // Editable title states (synced to LocalStorage)
  const [schedulerTitle, setSchedulerTitle] = useState(() => {
    return localStorage.getItem('excel_scheduler_title') || '스케쥴표';
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // 1. Initial Tasks State (lists) from LocalStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('excel_tasks');
    if (saved) return JSON.parse(saved);

    // Initial premium Korean demo tasks with { id, text, status }
    const today = new Date();
    const formattedToday = formatDateString(today);
    const formattedTomorrow = formatDateString(new Date(today.getTime() + 86400000));
    
    return {
      [formattedToday]: [
        {
          id: 'demo-t1',
          text: '주간 부서 기획서 검토 및 상신 완료 📑',
          status: 'completed'
        },
        {
          id: 'demo-t2',
          text: '애플 디자인 명세 기준 엑셀 스케줄표 컴포넌트 리빌드',
          status: 'in-progress'
        },
        {
          id: 'demo-t3',
          text: '대한민국 공휴일 자동 표시 기능 디버깅 및 예외 케이스 검증',
          status: 'not-started'
        }
      ],
      [formattedTomorrow]: [
        {
          id: 'demo-t4',
          text: '디자인 전면 교차 검증 및 개발팀 피드백 회의 참석 🗣️',
          status: 'not-started'
        }
      ]
    };
  });

  // 2. Initial Weekly Memos State from LocalStorage
  const [weeklyMemos, setWeeklyMemos] = useState(() => {
    const saved = localStorage.getItem('excel_weekly_memos');
    if (saved) return JSON.parse(saved);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    
    return {
      [`${year}-${month}-w1`]: '이번 주 핵심 성과 지표:\n- 엑셀 격자 스케줄표 레이아웃 완료\n- 공휴일 자동 렌더링 매칭 완료\n- 다차원 3단계 태스크 사이클 연동',
      [`${year}-${month}-w2`]: '주요 예견 일정:\n- 2차 전역 QA 스케줄 확보\n- 로컬 브라우저 보안 샌드박스 테스팅'
    };
  });

  // 3. Persist states to LocalStorage
  useEffect(() => {
    localStorage.setItem('excel_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('excel_weekly_memos', JSON.stringify(weeklyMemos));
  }, [weeklyMemos]);

  useEffect(() => {
    localStorage.setItem('excel_scheduler_title', schedulerTitle);
  }, [schedulerTitle]);

  // 4. Task Operations
  const handleAddTask = (dateString) => {
    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      text: '', // Start empty for typing
      status: 'not-started'
    };

    setTasks(prev => {
      const dayTasks = prev[dateString] ? [...prev[dateString]] : [];
      return {
        ...prev,
        [dateString]: [...dayTasks, newTask]
      };
    });
  };

  const handleUpdateTaskText = (dateString, taskId, text) => {
    setTasks(prev => {
      const dayTasks = prev[dateString] ? [...prev[dateString]] : [];
      const updated = dayTasks.map(t => t.id === taskId ? { ...t, text } : t);
      return {
        ...prev,
        [dateString]: updated
      };
    });
  };

  const handleCycleTaskStatus = (dateString, taskId) => {
    setTasks(prev => {
      const dayTasks = prev[dateString] ? [...prev[dateString]] : [];
      const updated = dayTasks.map(t => {
        if (t.id === taskId) {
          let nextStatus = 'not-started';
          if (t.status === 'not-started') nextStatus = 'in-progress';
          else if (t.status === 'in-progress') nextStatus = 'completed';
          return { ...t, status: nextStatus };
        }
        return t;
      });
      return {
        ...prev,
        [dateString]: updated
      };
    });
  };

  const handleDeleteTask = (dateString, taskId) => {
    setTasks(prev => {
      const dayTasks = prev[dateString] ? [...prev[dateString]] : [];
      const updated = dayTasks.filter(t => t.id !== taskId);
      return {
        ...prev,
        [dateString]: updated
      };
    });
  };

  // 5. Weekly Memo operations
  const handleUpdateWeeklyMemo = (weekKey, text) => {
    setWeeklyMemos(prev => ({
      ...prev,
      [weekKey]: text
    }));
  };

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  return (
    <div className="app-container">
      {/* Top Header Section */}
      <header className="header-section">
        <div className="title-group">
          {isEditingTitle ? (
            <input
              type="text"
              className="title-input-field"
              value={schedulerTitle}
              onChange={(e) => setSchedulerTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingTitle(false);
              }}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
              maxLength={50}
              placeholder="스케쥴표 이름 입력..."
            />
          ) : (
            <h1 className="scheduler-title-text" onClick={() => setIsEditingTitle(true)}>
              {schedulerTitle}
              <Pencil size={16} className="title-edit-icon" />
            </h1>
          )}
        </div>


        {/* Month Switching Controls */}
        <div className="navigation-bar">
          <button 
            className="briefing-toggle-btn" 
            onClick={() => setIsBriefingOpen(true)}
            style={{ marginRight: '8px' }}
          >
            <span className="live-pulse-dot"></span>
            오늘의 브리핑
          </button>
          <button className="today-btn" onClick={handleGoToday}>오늘</button>
          <button className="nav-btn" onClick={handlePrevMonth} aria-label="이전 달">◀</button>
          <span className="current-month-display">
            {currentYear}년 {currentMonth + 1}월
          </span>
          <button className="nav-btn" onClick={handleNextMonth} aria-label="다음 달">▶</button>
        </div>
      </header>

      {/* Main Full-Width Excel Grid Scheduler */}
      <ExcelScheduler
        currentYear={currentYear}
        currentMonth={currentMonth}
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTaskText={handleUpdateTaskText}
        onCycleTaskStatus={handleCycleTaskStatus}
        onDeleteTask={handleDeleteTask}
        weeklyMemos={weeklyMemos}
        onUpdateWeeklyMemo={handleUpdateWeeklyMemo}
        todayStr={todayStr}
      />

      {/* Slide-out Intelligence Briefing Drawer */}
      <DailyBriefing 
        isOpen={isBriefingOpen} 
        onClose={() => setIsBriefingOpen(false)} 
      />
    </div>
  );
}

export default App;
