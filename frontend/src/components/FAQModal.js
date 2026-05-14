import React, { useState } from 'react';

const FAQModal = ({ isOpen, onClose }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      question: "如何下单？",
      answer: "只需浏览我们的商品，将商品添加到购物车，然后结账。您需要创建账户或登录才能完成购买。"
    },
    {
      question: "你们接受哪些支付方式？",
      answer: "我们接受所有主要信用卡、PayPal和银行转账。所有支付都通过加密支付网关安全处理。"
    },
    {
      question: "配送需要多长时间？",
      answer: "标准配送在国内需要3-5个工作日，国际订单需要7-14个工作日。我们提供加急配送选项以加快送达。"
    },
    {
      question: "我可以追踪我的订单吗？",
      answer: "是的！订单发货后，您将通过邮箱收到追踪号码。您也可以在账户仪表板中追踪订单状态。"
    },
    {
      question: "你们的退货政策是什么？",
      answer: "我们为大多数商品提供30天退货政策。商品必须保持原样并附有标签。请参阅我们的退换货政策了解详情。"
    },
    {
      question: "如何联系客服？",
      answer: "您可以通过WhatsApp +234 704 907 3197、邮箱 dera.delis@gmail.com 或联系我们表单联系我们。我们通常在24小时内回复。"
    },
    {
      question: "你们提供国际配送吗？",
      answer: "是的，我们向大多数国家和地区发货。国际配送费率和时间因目的地而异。在结账时查看您所在地区的具体费率。"
    },
    {
      question: "如何更新账户信息？",
      answer: "登录您的账户，进入「账户设置」更新您的个人信息、收货地址和支付方式。"
    },
    {
      question: "如果收到损坏的商品怎么办？",
      answer: "如果您收到损坏的商品，请立即联系我们并附上损坏照片。我们将为您安排更换或全额退款，无需您承担任何费用。"
    },
    {
      question: "你们有移动应用吗？",
      answer: "目前我们没有移动应用，但我们的网站完全响应并针对移动设备进行了优化。您可以收藏我们的网站以便轻松访问。"
    }
  ];

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full max-h-[80vh] overflow-y-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    常见问题
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
                <div className="mt-2">
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleItem(index)}
                          className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          <svg
                            className={`h-5 w-5 text-gray-500 transform transition-transform ${
                              openItems[index] ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openItems[index] && (
                          <div className="px-4 pb-3">
                            <p className="text-sm text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
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

export default FAQModal;