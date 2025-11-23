import { useState } from 'react';
type ProfileProps = {
  mbtiType: string;
  name: string;
  code: string;
  avatarUrl?: string;
  methods: string[];
  onUpdateProfile?: (profile: { name: string; code: string; avatarUrl?: string }) => void;
  onUpdateMethods?: (methods: string[]) => void;
};

export default function Profile({ mbtiType, name, code, avatarUrl, methods, onUpdateMethods, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localMethods, setLocalMethods] = useState<string[]>(methods);
  const options = ["番茄钟", "四象限", "时间块", "GTD"];
  const toggleMethod = (m: string) => {
    setLocalMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };
  const save = () => {
    onUpdateMethods?.(localMethods);
    setIsEditing(false);
  };
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-b-2xl shadow">
        <div className="p-6 flex items-center justify-between">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover mr-4" />
          ) : (
            <div className="w-14 h-14 rounded-full mr-4 bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">
              {name.slice(0,1)}
            </div>
          )}
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">编码：{code}</div>
          </div>
          <button onClick={() => setIsEditing(true)} className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800">编辑资料</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-xs text-gray-500 mb-1">MBTI 类型</div>
          <div className="text-xl font-bold text-purple-700">{mbtiType}</div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-xs text-gray-500 mb-2">偏好任务管理方式</div>
          <div className="flex flex-wrap gap-2">
            {methods.map((m) => (
              <span key={m} className="px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-700">
                {m}
              </span>
            ))}
          </div>
          <div className="mt-3">
            <button onClick={() => { setLocalMethods(methods); setIsEditing(true); }} className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800">编辑偏好</button>
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black/30 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-4">
            <div className="text-base font-semibold text-gray-900 mb-2">编辑资料</div>
            <div className="grid grid-cols-1 gap-3 mb-4">
              <input
                className="px-3 py-2 border rounded-lg text-sm"
                placeholder="姓名"
                value={name}
                onChange={(e) => onUpdateProfile?.({ name: e.target.value, code, avatarUrl })}
              />
              <input
                className="px-3 py-2 border rounded-lg text-sm"
                placeholder="编码"
                value={code}
                onChange={(e) => onUpdateProfile?.({ name, code: e.target.value, avatarUrl })}
              />
              <input
                className="px-3 py-2 border rounded-lg text-sm"
                placeholder="头像 URL（可选）"
                value={avatarUrl || ''}
                onChange={(e) => onUpdateProfile?.({ name, code, avatarUrl: e.target.value })}
              />
            </div>
            <div className="text-base font-semibold text-gray-900 mb-2">选择偏好</div>
            <div className="text-sm text-gray-500 mb-4">可多选</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleMethod(opt)}
                  className={`px-3 py-1 rounded-full text-xs border ${localMethods.includes(opt) ? 'bg-purple-100 border-purple-300 text-purple-700' : 'border-gray-300 text-gray-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-gray-600">取消</button>
              <button onClick={save} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}