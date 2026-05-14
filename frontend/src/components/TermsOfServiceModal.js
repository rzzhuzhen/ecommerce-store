import React from 'react';

const TermsOfServiceModal = ({ isOpen, onClose }) => {
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
                    服务条款
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
                    <h4 className="font-semibold text-gray-900 mb-2">1. 条款接受</h4>
                    <p>通过访问和使用本网站，您接受并同意受本协议条款和条件的约束。如果您不同意遵守上述条款，请不要使用本服务。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">2. 使用许可</h4>
                    <p className="mb-2">我们授予您临时下载一份我们网站上的材料用于个人、非商业性的临时查看的许可。这是许可的授予，而非所有权的转让，根据此许可，您不得：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>修改或复制材料</li>
                      <li>将材料用于任何商业目的或公开展示</li>
                      <li>尝试反向工程包含在网站上的任何软件</li>
                      <li>从材料中移除任何版权或其他专有 notations</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3. 用户账户</h4>
                    <p className="mb-2">当您在我们这里创建账户时，您必须始终提供准确、完整和最新的信息。您负责：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>保护密码和账户下所有活动的安全</li>
                      <li>立即通知我们任何未经授权使用您账户的情况</li>
                      <li>确保您的账户信息保持准确和最新</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">4. 产品信息和定价</h4>
                    <p className="mb-2">我们努力提供准确的产品信息和定价。但是：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>产品描述和图片仅用于说明目的</li>
                      <li>价格如有变更，恕不另行通知</li>
                      <li>我们保留限制数量和拒绝服务的权利</li>
                      <li>不保证产品的可用性</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">5. 支付条款</h4>
                    <p className="mb-2">付款应在购买时到期。我们接受各种支付方式，包括：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>信用卡和借记卡</li>
                      <li>PayPal</li>
                      <li>银行转账</li>
                    </ul>
                    <p className="mt-2">所有付款都通过加密支付网关安全处理。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">6. 配送和交付</h4>
                    <p className="mb-2">配送条款包括：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>交付时间是估计值，不保证</li>
                      <li>损失风险在交付时转移给您</li>
                      <li>国际配送可能收取附加费用</li>
                      <li>对于配送公司造成的延误，我们不承担责任</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">7. 退货和退款</h4>
                    <p>退货和退款受我们的退货政策约束。商品必须在原始状态下30天内退回。退款将在收到退回商品后5-10个工作日内处理至原支付方式。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">8. 禁止使用</h4>
                    <p className="mb-2">您不得使用我们的网站：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>用于任何非法目的或 solicited others to perform unlawful acts</li>
                      <li> violates any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                      <li>侵犯或违反我们的知识产权或他人的知识产权</li>
                      <li>骚扰、虐待、侮辱、伤害、诽谤、 slander、贬低、恐吓或歧视</li>
                      <li>提交虚假或误导性信息</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">9. 责任限制</h4>
                    <p>在任何情况下，电商商城、其董事、员工、合作伙伴、代理、供应商或关联公司均不对任何间接、偶然、特殊、后果性或惩罚性损害负责，包括但不限于利润、数据、使用、商誉或其他无形损失的损失，这些损失源于您对服务的使用。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">10. 管辖法律</h4>
                    <p>本条款受尼日利亚法律解释和管辖，不考虑其法律冲突规定。我们未能执行任何权利或条款不构成对这些权利的放弃。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">11. 条款变更</h4>
                    <p>我们保留随时修改或替换这些条款的权利。如果变更是重大的，我们将尝试在任何新条款生效前至少30天发出通知。</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">12. 联系信息</h4>
                    <p>如果您对这些服务条款有任何疑问，请通过以下方式联系我们：</p>
                    <ul className="list-none space-y-1 ml-4 mt-2">
                      <li>邮箱: dera.delis@gmail.com</li>
                      <li>WhatsApp: +234 704 907 3197</li>
                    </ul>
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

export default TermsOfServiceModal;