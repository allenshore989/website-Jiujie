import React from 'react';

// 定义分支机构数据类型
interface BranchOffice {
  city: string;
  address: string;
  phone: string;
  email: string;
}

// 默认分支机构数据
const defaultBranches: BranchOffice[] = [
  {
    city: '北京总部',
    address: '朝阳区建国路88号',
    phone: '010-12345678',
    email: 'beijing@yijingdesign.cn'
  },
  {
    city: '上海分部',
    address: '浦东新区陆家嘴金融中心',
    phone: '021-87654321',
    email: 'shanghai@yijingdesign.cn'
  },
  {
    city: '广州分部',
    address: '天河区珠江新城',
    phone: '020-56781234',
    email: 'guangzhou@yijingdesign.cn'
  },
  {
    city: '成都分部',
    address: '锦江区红星路',
    phone: '028-98765432',
    email: 'chengdu@yijingdesign.cn'
  },
  {
    city: '深圳分部',
    address: '南山区科技园',
    phone: '0755-23456789',
    email: 'shenzhen@yijingdesign.cn'
  },
  {
    city: '杭州分部',
    address: '西湖区文三路',
    phone: '0571-87654321',
    email: 'hangzhou@yijingdesign.cn'
  }
];

interface BranchOfficesManagerProps {
  onSave?: (branches: BranchOffice[]) => void;
}

export default function BranchOfficesManager({ onSave }: BranchOfficesManagerProps) {
  const [branches, setBranches] = React.useState<BranchOffice[]>([]);
  const [editingBranch, setEditingBranch] = React.useState<BranchOffice | null>(null);
  const [editIndex, setEditIndex] = React.useState<number>(-1);
  const [showModal, setShowModal] = React.useState(false);
  
  // 初始化时加载数据
  React.useEffect(() => {
    const loadBranches = () => {
      try {
        // 确保代码运行在客户端
        if (typeof window !== 'undefined') {
          const savedBranches = localStorage.getItem('branchOffices');
          if (savedBranches) {
            setBranches(JSON.parse(savedBranches));
          } else {
            // 如果没有保存的数据，使用默认数据
            setBranches(defaultBranches);
            localStorage.setItem('branchOffices', JSON.stringify(defaultBranches));
          }
        }
      } catch (error) {
        console.error('加载分支机构数据出错:', error);
        setBranches(defaultBranches);
      }
    };
    
    loadBranches();
  }, []);
  
  // 保存分支机构数据
  const saveBranches = (updatedBranches: BranchOffice[]) => {
    try {
      // 确保代码运行在客户端
      if (typeof window !== 'undefined') {
        localStorage.setItem('branchOffices', JSON.stringify(updatedBranches));
        if (onSave) {
          onSave(updatedBranches);
        }
      }
    } catch (error) {
      console.error('保存分支机构数据出错:', error);
    }
  };
  
  // 添加新分支机构
  const handleAddBranch = () => {
    setEditingBranch({
      city: '',
      address: '',
      phone: '',
      email: ''
    });
    setEditIndex(-1);
    setShowModal(true);
  };
  
  // 编辑分支机构
  const handleEditBranch = (branch: BranchOffice, index: number) => {
    setEditingBranch({ ...branch });
    setEditIndex(index);
    setShowModal(true);
  };
  
  // 删除分支机构
  const handleDeleteBranch = (index: number) => {
    const updatedBranches = [...branches];
    updatedBranches.splice(index, 1);
    setBranches(updatedBranches);
    saveBranches(updatedBranches);
  };
  
  // 保存分支机构编辑
  const handleSaveBranch = () => {
    if (!editingBranch) return;
    
    const updatedBranches = [...branches];
    if (editIndex >= 0) {
      // 更新现有分支机构
      updatedBranches[editIndex] = editingBranch;
    } else {
      // 添加新分支机构
      updatedBranches.push(editingBranch);
    }
    
    setBranches(updatedBranches);
    saveBranches(updatedBranches);
    setShowModal(false);
  };
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingBranch) {
      setEditingBranch({
        ...editingBranch,
        [name]: value
      });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">分支机构管理</h3>
        <button
          type="button"
          onClick={handleAddBranch}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          添加分支机构
        </button>
      </div>
      
      {branches.length === 0 ? (
        <p className="text-gray-500 italic">暂无分支机构数据</p>
      ) : (
        <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">城市</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地址</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">电话</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branches.map((branch: BranchOffice, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditBranch(branch, index)} 
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => handleDeleteBranch(index)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 编辑模态框 */}
      {showModal && editingBranch && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editIndex >= 0 ? '编辑分支机构' : '添加分支机构'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">城市名称</label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          value={editingBranch.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">详细地址</label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          value={editingBranch.address}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">联系电话</label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          value={editingBranch.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">电子邮箱</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          value={editingBranch.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSaveBranch}
                >
                  保存
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 