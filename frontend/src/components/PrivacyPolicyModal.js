import React from 'react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
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
                    隐私政策
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
                    <h4 className="font-semibold text-gray-900 mb-2">1. 我们收集的信息</h4>
                    <p className="mb-2">我们收集您直接向我们提供的信息，例如：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>创建账户或更新个人资料时</li>
                      <li>购买或下订单时</li>
                      <li>联系我们客服时</li>
                      <li>订阅我们的新闻通讯时</li>
                      <li>参与调查或促销活动时</li>
                    </ul>
                    <p className="mt-2">这可能包括您的姓名、电子邮件地址、电话号码、收货地址、支付信息以及您选择提供的其他详细信息。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">2. 我们如何使用您的信息</h4>
                    <p className="mb-2">我们使用收集的信息来：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>处理和完成您的订单</li>
                      <li>提供客服支持并回复您的询问</li>
                      <li>向您发送订单确认、发货更新和账户通知</li>
                      <li>改进我们的网站、产品和服务</li>
                      <li>向您发送营销通讯（经您同意）</li>
                      <li>防止欺诈并确保安全</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3. 信息共享</h4>
                    <p className="mb-2">我们不会出售、交易或以其他方式将您的个人信息转让给第三方，除非：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>与服务提供商共享以帮助我们运营网站和开展业务</li>
                      <li>法律要求或保护我们的权利时</li>
                      <li>与业务转让或收购相关时</li>
                      <li>经您明确同意时</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">4. 数据安全</h4>
                    <p>我们实施适当的安全措施，保护您的个人信息免受未经授权的访问、修改、披露或破坏。但是，通过互联网传输的方法并非100%安全。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">5. Cookie和追踪</h4>
                    <p>我们使用Cookie和类似技术来增强您的浏览体验、分析网站流量和个性化内容。您可以通过浏览器偏好设置控制Cookie设置。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">6. 您的权利</h4>
                    <p className="mb-2">您有权：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>访问和更新您的个人信息</li>
                      <li>要求删除您的账户和数据</li>
                      <li>选择退出营销通讯</li>
                      <li>要求获取您的数据副本</li>
                      <li>撤回对数据处理的同意</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">7. 联系我们</h4>
                    <p>如果您对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
                    <ul className="list-none space-y-1 ml-4 mt-2">
                      <li>邮箱: dera.delis@gmail.com</li>
                      <li>WhatsApp: +234 704 907 3197</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800 text-sm">
                      <strong>注意:</strong> 本隐私政策可能会不时更新。我们将通过在此页面发布新政策来通知您任何重大变更。
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

export default PrivacyPolicyModal;