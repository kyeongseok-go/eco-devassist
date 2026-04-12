import { useState } from 'react';
import { X } from 'lucide-react';
import type { ECO, ECOPriority, ChangeType } from '../../types';

interface ECOCreateModalProps {
  onClose: () => void;
  onCreate: (eco: ECO) => void;
}

export function ECOCreateModal({ onClose, onCreate }: ECOCreateModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<ECOPriority>('medium');
  const [targetBOM, setTargetBOM] = useState('ASM-001');
  const [changeType, setChangeType] = useState<ChangeType>('parameter');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!title || !description || !reason) return;
    const eco: ECO = {
      id: `ECO-2026-${String(Date.now()).slice(-3)}`,
      title,
      status: 'draft',
      priority,
      requestDate: new Date().toISOString().split('T')[0],
      requester: '고경석',
      targetBOMItem: targetBOM,
      changeType,
      changeDescription: description,
      reason,
    };
    onCreate(eco);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-navy-900 border border-navy-700 rounded-lg w-[560px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-700">
          <h2 className="text-lg font-bold text-white">신규 ECO 생성</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-navy-800 text-navy-500"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="제목">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="변경 제목을 입력하세요" />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="우선순위">
              <select value={priority} onChange={(e) => setPriority(e.target.value as ECOPriority)} className="input">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </Field>
            <Field label="변경 대상 부품">
              <select value={targetBOM} onChange={(e) => setTargetBOM(e.target.value)} className="input">
                <option value="ASM-001">BCM-200 탄도 계산 모듈</option>
                <option value="ASM-002">SIL-300 안전 연동 장치</option>
                <option value="ASM-003">FCP-150 사격통제 프로세서</option>
                <option value="ASM-004">TSI-500 열상 센서 인터페이스</option>
                <option value="ASM-005">LRF-510 레이저 거리측정기</option>
                <option value="ASM-006">TDL-610 전술 데이터링크</option>
                <option value="ASM-007">CPH-620 통신 프로토콜 처리기</option>
              </select>
            </Field>
            <Field label="변경 유형">
              <select value={changeType} onChange={(e) => setChangeType(e.target.value as ChangeType)} className="input">
                <option value="parameter">파라미터</option>
                <option value="design">설계</option>
                <option value="material">자재</option>
                <option value="software">소프트웨어</option>
              </select>
            </Field>
          </div>
          <Field label="변경 내용">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input min-h-[80px]" placeholder="변경 내용을 상세히 기술하세요" />
          </Field>
          <Field label="변경 사유">
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="input min-h-[60px]" placeholder="변경이 필요한 사유를 기술하세요" />
          </Field>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-navy-700">
          <button onClick={onClose} className="px-4 py-2 text-sm text-navy-500 hover:text-white transition-colors">취소</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-accent-green text-navy-950 font-medium rounded hover:bg-accent-green-dim transition-colors">생성</button>
        </div>
      </div>
      <style>{`.input { width: 100%; background: #162040; border: 1px solid #1e2d5a; border-radius: 6px; padding: 8px 12px; color: white; font-size: 13px; } .input:focus { outline: none; border-color: #00e676; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-navy-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
