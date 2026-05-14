import React from 'react';

const ReturnsExchangesModal = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    退换货政策
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
                <div className="mt-2 text-sm text-gray-500 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">退货政策</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>商品可在购买后30天内退货</li>
                      <li>商品必须保持原样并附有标签</li>
                      <li>需要原始收据或订单确认</li>
                      <li>退货运费由顾客承担</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">换货政策</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>可换不同尺寸或颜色的商品</li>
                      <li>换货请求须在14天内提出</li>
                      <li>换至更高价值商品需补差价</li>
                      <li>换至更低价值商品将退款</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">如何退货/换货</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>通过WhatsApp或邮箱联系客服</li>
                      <li>提供订单号和退货/换货原因</li>
                      <li>获取退货授权和配送说明</li>
                      <li>将商品安全包装并寄回我们的地址</li>
                      <li>收到后，我们将在3-5个工作日内处理您的退货或换货</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800 text-sm">
                      <strong>注意:</strong> 由于卫生原因，某些商品可能不符合退货条件（例如：护理用品、内衣）。请查看商品描述了解退货资格。
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

export default ReturnsExchangesModal;