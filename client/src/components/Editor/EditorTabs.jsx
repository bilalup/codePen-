const EditorTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'html', name: 'HTML', icon: '📄' },
    { id: 'css', name: 'CSS', icon: '🎨' },
    { id: 'js', name: 'JavaScript', icon: '⚡' }
  ];

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? 'text-primary-600 border-b-2 border-primary-600 bg-white dark:bg-gray-900'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  );
};

export default EditorTabs;