import React from 'react';

const CookiePolicyModal = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[80vh] overflow-y-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Cookie政策
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600 space-y-4">
                  <p className="text-xs text-gray-500">最后更新: {new Date().toLocaleDateString()}</p>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">什么是Cookie？</h4>
                    <p>Cookie是访问网站时放置在您计算机或移动设备上的小型文本文件。它们被广泛用于使网站更高效地工作，并为网站所有者提供信息。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">我们如何使用Cookie</h4>
                    <p className="mb-2">我们出于多种目的使用Cookie：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>记住您的偏好和设置</li>
                      <li>保持您登录您的账户</li>
                      <li>记住购物车中的商品</li>
                      <li>分析我们网站的使用情况</li>
                      <li>改进我们网站的性能和功能</li>
                      <li>提供个性化内容和广告</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">我们使用的Cookie类型</h4>

                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-900">必要Cookie</h5>
                        <p className="text-sm">这些Cookie对于网站正常运行是必要的。它们启用页面导航、访问安全区域和记住登录状态等基本功能。没有这些Cookie，网站无法正常运行。</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900">性能Cookie</h5>
                        <p className="text-sm">这些Cookie收集有关访问者如何使用我们网站的信息，例如最常访问哪些页面。这有助于我们改进网站的工作方式并提供更好的用户体验。</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900">功能Cookie</h5>
                        <p className="text-sm">这些Cookie允许网站记住您做出的选择（如用户名、语言或地区）并提供增强的、更个性化的功能。</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900">定向/广告Cookie</h5>
                        <p className="text-sm">这些Cookie用于向您投放更相关的广告。它们还可能用于限制您看到广告的次数并衡量广告活动的效果。</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">第三方Cookie</h4>
                    <p className="mb-2">我们也可能使用可信合作伙伴的第三方Cookie用于：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>分析和性能监控</li>
                      <li>社交媒体集成</li>
                      <li>支付处理</li>
                      <li>客服工具</li>
                      <li>营销和广告</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">管理Cookie</h4>
                    <p className="mb-2">您可以通过多种方式控制和管理Cookie：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>通过浏览器设置（大多数浏览器允许您拒绝或删除Cookie）</li>
                      <li>通过使用我们的Cookie偏好中心（如果可用）</li>
                      <li>通过在各自网站上选择退出特定第三方Cookie</li>
                    </ul>
                    <p className="mt-2 text-sm">请注意，禁用某些Cookie可能会影响我们网站的功能。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">特定浏览器说明</h4>
                    <div className="space-y-2">
                      <p><strong>Chrome:</strong> 设置 → 隐私和安全 → Cookie和其他站点数据</p>
                      <p><strong>Firefox:</strong> 选项 → 隐私与安全 → Cookie和站点数据</p>
                      <p><strong>Safari:</strong> 偏好设置 → 隐私 → 管理网站数据</p>
                      <p><strong>Edge:</strong> 设置 → Cookie和站点权限 → Cookie和站点数据</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cookie保留期</h4>
                    <p>Cookie的存储时间因目的而异：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>会话Cookie：关闭浏览器时删除</li>
                      <li>持久Cookie：在您的设备上保留一段固定时间或直到手动删除</li>
                      <li>必要Cookie：通常在会话期间保留</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">本政策更新</h4>
                    <p>我们可能会不时更新本Cookie政策，以反映我们实践的变化或出于其他运营、法律或监管原因。我们将通过在我们的网站上发布更新后的政策来通知您任何重大变更。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">联系我们</h4>
                    <p>如果您对我们的Cookie使用有任何疑问，请通过以下方式联系我们：</p>
                    <ul className="list-none space-y-1 ml-4 mt-2">
                      <li>邮箱: dera.delis@gmail.com</li>
                      <li>WhatsApp: +234 704 907 3197</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800 text-sm">
                      <strong>注意:</strong> 继续使用我们的网站，即表示您同意我们按照本政策中所述使用Cookie。您可以随时通过调整浏览器设置或联系我们来撤回您的同意。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyModal;