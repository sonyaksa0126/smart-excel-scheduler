import React, { useState, useEffect } from 'react';
import ExcelScheduler from './components/ExcelScheduler';
import { formatDateString } from './utils/dateUtils';
import { Pencil, Share2, X, RefreshCw, AlertTriangle } from 'lucide-react';

function App() {
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

  // --- Real-time Cloud Device Sync States ---
  const [roomCode, setRoomCode] = useState(() => {
    return localStorage.getItem('sync_room_code') || '';
  });
  const [isSyncEnabled, setIsSyncEnabled] = useState(() => {
    return localStorage.getItem('is_sync_enabled') === 'true';
  });
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [syncError, setSyncError] = useState('');
  const [isSyncLoading, setIsSyncLoading] = useState(false);

  // 1. Initial Tasks State (lists) from LocalStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('excel_tasks');
    let parsed = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse excel_tasks", e);
      }
    }

    if (!parsed) {
      const today = new Date();
      const formattedToday = formatDateString(today);
      const formattedTomorrow = formatDateString(new Date(today.getTime() + 86400000));
      
      parsed = {
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
    }

    // Proactive newline splitting and sanitization
    const sanitizedTasks = {};
    Object.keys(parsed).forEach(dateStr => {
      const list = parsed[dateStr];
      if (Array.isArray(list)) {
        const newList = [];
        list.forEach((t, idx) => {
          if (t && typeof t.text === 'string' && /\r?\n/.test(t.text)) {
            const lines = t.text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length > 0) {
              newList.push({
                ...t,
                text: lines[0]
              });
              for (let i = 1; i < lines.length; i++) {
                newList.push({
                  id: 'task-sanit-' + Date.now().toString() + Math.random().toString(36).substr(2, 4) + '-' + idx + '-' + i,
                  text: lines[i],
                  status: t.status || 'not-started'
                });
              }
            }
          } else if (t) {
            newList.push(t);
          }
        });
        sanitizedTasks[dateStr] = newList;
      } else {
        sanitizedTasks[dateStr] = list;
      }
    });

    return sanitizedTasks;
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

  // 3. Persist local states to LocalStorage
  useEffect(() => {
    localStorage.setItem('excel_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('excel_weekly_memos', JSON.stringify(weeklyMemos));
  }, [weeklyMemos]);

  useEffect(() => {
    localStorage.setItem('excel_scheduler_title', schedulerTitle);
  }, [schedulerTitle]);

  // Sync state settings to LocalStorage
  useEffect(() => {
    localStorage.setItem('sync_room_code', roomCode);
    localStorage.setItem('is_sync_enabled', isSyncEnabled ? 'true' : 'false');
  }, [roomCode, isSyncEnabled]);

  // --- Real-time Polling Trigger (10 seconds) ---
  useEffect(() => {
    if (!isSyncEnabled || !roomCode) return;

    const fetchLatestFromCloud = () => {
      fetch(`https://kvdb.io/NsAqjZTmyB17VMxqwcWDn/${roomCode}`)
        .then(res => {
          if (res.status === 200) return res.json();
          throw new Error("No cloud sync data found");
        })
        .then(data => {
          // Compare with local stringified state to prevent endless state updates
          const localString = JSON.stringify({ tasks, weeklyMemos, schedulerTitle });
          const cloudString = JSON.stringify({ tasks: data.tasks, weeklyMemos: data.weeklyMemos, schedulerTitle: data.schedulerTitle });

          if (localString !== cloudString) {
            setTasks(data.tasks || {});
            setWeeklyMemos(data.weeklyMemos || {});
            setSchedulerTitle(data.schedulerTitle || '스케쥴표');
          }
        })
        .catch(err => {
          console.warn("Real-time cloud polling failed:", err);
        });
    };

    // Poll immediately once, then every 10 seconds
    fetchLatestFromCloud();
    const interval = setInterval(fetchLatestFromCloud, 10000);

    return () => clearInterval(interval);
  }, [isSyncEnabled, roomCode, tasks, weeklyMemos, schedulerTitle]);

  // --- Central Helper: Saves locally & syncs to cloud on changes ---
  const saveAndSync = (updatedTasks, updatedMemos, updatedTitle) => {
    if (updatedTasks !== undefined) setTasks(updatedTasks);
    if (updatedMemos !== undefined) setWeeklyMemos(updatedMemos);
    if (updatedTitle !== undefined) setSchedulerTitle(updatedTitle);

    // If device sync is active, upload payload to kvdb.io cloud
    if (isSyncEnabled && roomCode) {
      const payload = {
        tasks: updatedTasks !== undefined ? updatedTasks : tasks,
        weeklyMemos: updatedMemos !== undefined ? updatedMemos : weeklyMemos,
        schedulerTitle: updatedTitle !== undefined ? updatedTitle : schedulerTitle,
        updatedAt: Date.now()
      };

      fetch(`https://kvdb.io/NsAqjZTmyB17VMxqwcWDn/${roomCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => {
        console.error("Cloud push failed:", err);
      });
    }
  };

  // 4. Task Operations (delegated through saveAndSync)
  const handleAddTask = (dateString, afterTaskId = null, customId = null) => {
    const newId = customId || (Date.now().toString() + Math.random().toString(36).substr(2, 5));
    const newTask = {
      id: newId,
      text: '', // Start empty
      status: 'not-started'
    };

    const dayTasks = tasks[dateString] ? [...tasks[dateString]] : [];
    let updatedDayTasks;
    if (afterTaskId) {
      const index = dayTasks.findIndex(t => t.id === afterTaskId);
      if (index !== -1) {
        updatedDayTasks = [...dayTasks];
        updatedDayTasks.splice(index + 1, 0, newTask);
      } else {
        updatedDayTasks = [...dayTasks, newTask];
      }
    } else {
      updatedDayTasks = [...dayTasks, newTask];
    }

    const updatedTasks = {
      ...tasks,
      [dateString]: updatedDayTasks
    };
    saveAndSync(updatedTasks);
  };

  const handleUpdateTaskText = (dateString, taskId, text) => {
    const dayTasks = tasks[dateString] ? [...tasks[dateString]] : [];
    const taskIndex = dayTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    // Check if the text contains newlines (from copy-paste)
    if (/\r?\n/.test(text)) {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length > 1) {
        const updatedDayTasks = [...dayTasks];
        // Replace the current item's text with the first line
        updatedDayTasks[taskIndex] = {
          ...updatedDayTasks[taskIndex],
          text: lines[0]
        };

        // Create new task objects for the remaining lines
        const newTasks = lines.slice(1).map((lineText, idx) => ({
          id: 'task-paste-' + Date.now().toString() + Math.random().toString(36).substr(2, 4) + '-' + idx,
          text: lineText,
          status: 'not-started'
        }));

        // Insert them immediately after the current task index
        updatedDayTasks.splice(taskIndex + 1, 0, ...newTasks);

        const updatedTasks = {
          ...tasks,
          [dateString]: updatedDayTasks
        };
        saveAndSync(updatedTasks);
        return;
      }
    }

    // Normal single-line update (strip any stray newlines if they happen)
    const sanitizedText = text.replace(/\r?\n|\r/g, ' ');
    const updatedTasks = {
      ...tasks,
      [dateString]: dayTasks.map(t => t.id === taskId ? { ...t, text: sanitizedText } : t)
    };
    saveAndSync(updatedTasks);
  };

  const handleCycleTaskStatus = (dateString, taskId) => {
    const dayTasks = tasks[dateString] ? [...tasks[dateString]] : [];
    const updatedTasks = {
      ...tasks,
      [dateString]: dayTasks.map(t => {
        if (t.id === taskId) {
          let nextStatus = 'not-started';
          if (t.status === 'not-started') nextStatus = 'in-progress';
          else if (t.status === 'in-progress') nextStatus = 'completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    };
    saveAndSync(updatedTasks);
  };

  const handleDeleteTask = (dateString, taskId) => {
    const dayTasks = tasks[dateString] ? [...tasks[dateString]] : [];
    const updatedTasks = {
      ...tasks,
      [dateString]: dayTasks.filter(t => t.id !== taskId)
    };
    saveAndSync(updatedTasks);
  };

  // 5. Weekly Memo operations (delegated through saveAndSync)
  const handleUpdateWeeklyMemo = (weekKey, text) => {
    const updatedMemos = {
      ...weeklyMemos,
      [weekKey]: text
    };
    saveAndSync(undefined, updatedMemos);
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

  // --- Sync Modal Actions ---
  const handleGenerateNewSyncCode = () => {
    setIsSyncLoading(true);
    setSyncError('');

    // Generate a random, simple 6-digit room code
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));

    // Upload current state as the initial database snapshot
    const payload = {
      tasks,
      weeklyMemos,
      schedulerTitle,
      updatedAt: Date.now()
    };

    fetch(`https://kvdb.io/NsAqjZTmyB17VMxqwcWDn/${generatedCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.ok) {
          setRoomCode(generatedCode);
          setIsSyncEnabled(true);
        } else {
          throw new Error("Failed to register room on server.");
        }
      })
      .catch(err => {
        setSyncError("동기화 코드를 생성하는 데 실패했습니다. 네트워크 상태를 확인하세요.");
        console.error(err);
      })
      .finally(() => {
        setIsSyncLoading(false);
      });
  };

  const handleConnectExistingCode = (e) => {
    e.preventDefault();
    if (!inputRoomCode.trim()) return;

    setIsSyncLoading(true);
    setSyncError('');

    const targetCode = inputRoomCode.trim();

    // Pull from cloud database to check if room exists
    fetch(`https://kvdb.io/NsAqjZTmyB17VMxqwcWDn/${targetCode}`)
      .then(res => {
        if (res.status === 200) return res.json();
        throw new Error("Invalid Room Code");
      })
      .then(data => {
        // Merge cloud data into our local state immediately
        setTasks(data.tasks || {});
        setWeeklyMemos(data.weeklyMemos || {});
        setSchedulerTitle(data.schedulerTitle || '스케쥴표');

        setRoomCode(targetCode);
        setIsSyncEnabled(true);
        setIsSyncModalOpen(false);
        setInputRoomCode('');
      })
      .catch(err => {
        setSyncError("유효하지 않은 동기화 코드이거나 연결이 불안정합니다.");
        console.error(err);
      })
      .finally(() => {
        setIsSyncLoading(false);
      });
  };

  const handleDisconnectSync = () => {
    // Reset sync settings (remains in local only mode, keeps data)
    setRoomCode('');
    setIsSyncEnabled(false);
    setIsSyncModalOpen(false);
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
              onChange={(e) => saveAndSync(tasks, weeklyMemos, e.target.value)}
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

        {/* Month Switching & Device Sync Controls */}
        <div className="navigation-bar">
          {/* Sync Button / Badge */}
          <div className="sync-btn-container">
            {isSyncEnabled && roomCode ? (
              <div className="sync-status-badge" onClick={() => setIsSyncModalOpen(true)}>
                <span className="dot"></span>
                <span>실시간 연동 중 ({roomCode})</span>
              </div>
            ) : (
              <button 
                className="sync-btn" 
                onClick={() => {
                  setSyncError('');
                  setIsSyncModalOpen(true);
                }}
              >
                <Share2 size={15} /> 기기 연동
              </button>
            )}
          </div>

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

      {/* --- Apple Spec Device Real-time Sync Modal --- */}
      {isSyncModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSyncModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Close Cross */}
            <button className="modal-close-btn" onClick={() => setIsSyncModalOpen(false)}>
              <X size={18} />
            </button>

            <h2 className="modal-title">기기 간 실시간 동기화</h2>
            <p className="modal-description">
              컴퓨터와 스마트폰 스케쥴표를 하나로 연결하세요. 작성한 일정이 10초마다 실시간 동기화됩니다.
            </p>

            <div className="modal-content-area">
              {isSyncEnabled && roomCode ? (
                // State: Synced
                <>
                  <div className="sync-code-box">
                    <span className="sync-code-label">연동된 동기화 코드</span>
                    <span className="sync-code-number">{roomCode}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#34c759', textAlign: 'center', fontWeight: '500' }}>
                    실시간 클라우드 연동이 활성화되어 있습니다.
                  </p>
                  <button 
                    type="button" 
                    className="modal-danger-btn"
                    onClick={handleDisconnectSync}
                  >
                    동기화 연결 해제
                  </button>
                </>
              ) : (
                // State: Not Synced
                <>
                  {/* Action 1: Generate code */}
                  <button 
                    type="button" 
                    className="modal-primary-btn"
                    onClick={handleGenerateNewSyncCode}
                    disabled={isSyncLoading}
                  >
                    {isSyncLoading ? "연결 중..." : "새 동기화 코드 발급하기"}
                  </button>

                  <div style={{ textAlign: 'center', color: '#86868b', fontSize: '0.85rem' }}>
                    또는
                  </div>

                  {/* Action 2: Connect existing code */}
                  <form onSubmit={handleConnectExistingCode} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="text"
                      className="modal-input"
                      value={inputRoomCode}
                      onChange={(e) => setInputRoomCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="6자리 코드 입력"
                      maxLength={6}
                      disabled={isSyncLoading}
                      required
                    />
                    <button 
                      type="submit" 
                      className="modal-secondary-btn"
                      disabled={isSyncLoading || inputRoomCode.length < 6}
                    >
                      기존 코드로 연결하기
                    </button>
                  </form>
                </>
              )}

              {/* Error messages */}
              {syncError && (
                <div style={{ display: 'flex', gap: '0.4rem', color: '#ff3b30', fontSize: '0.85rem', background: 'rgba(255, 59, 48, 0.06)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255, 59, 48, 0.15)' }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span>{syncError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
