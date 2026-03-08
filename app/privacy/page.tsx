import DocumentPage from "../components/DocumentPage";

export default function PrivacyPage() {
  return (
    <DocumentPage title="プライバシーポリシー">
      <section className="mb-8">
        <h2 className="text-base font-bold mb-4">1. 基本方針</h2>
        <p>withHERO(以下、「当社」といいます。)は、個人情報の重要性を認識し、 個人情報を保護することが社会的責務であると考え、個人情報に関する法令及び社内規程等を遵守し、当社で取扱う個人情報の取得、利用、管理を適正に行います。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-4">2. 適用範囲</h2>
        <p>本プライバシーポリシーは、当社が行う各種サービスにおいて、ご本人様の個人情報もしくはそれに準ずる情報を取り扱う際に、当社が遵守する方針を示したものです。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-4">3. 個人情報の取得と利用目的</h2>
        <p>ご本人様から寄せられたご質問、ご意見、ご要望にお応えするために利用します。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-4">4. 個人情報の管理</h2>
        <p className="mb-4">当社は、ご本人様からご提供いただいた情報の管理について、以下を徹底します。</p>

        <h3 className="font-bold mt-4 mb-2">1). 安全管理措置</h3>
        <p>当社は、組織的な個人情報の管理については、社内規定による厳重に取扱方法を規定し、それに基づいた取扱いを徹底しています。</p>

        <h3 className="font-bold mt-4 mb-2">2). 従業者の監督</h3>
        <p>当社は、当社の規程に基づき、個人情報取扱い規程の厳格な運用を徹底しています。</p>

        <h3 className="font-bold mt-4 mb-2">3). 委託先の監督</h3>
        <p>個人情報の取扱いを外部に委託する場合には、当社の規程に基づき、要件を満たした委託先にのみ委託を行い、適切な管理を行います。</p>

        <h3 className="font-bold mt-4 mb-2">4). 保存期間と廃棄</h3>
        <p>お客様からご提供いただいた情報については、保存期間を設定し、保存期間終了後は廃棄します。また、保存期間内であっても、不要となった場合にはすみやかに廃棄します。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-4">5. 第三者提供の有無</h2>
        <p className="mb-4">次に掲げる場合を除き、ご本人様の個人情報を第三者に提供することはございません。</p>
        <p>1).ご本人様の同意がある場合</p>
        <p>2).法令に基づく場合</p>
        <p>3).人の生命、身体又は財産の保護のために必要がある場合であって、ご本人様の同意を得ることが困難な場合</p>
        <p>4).公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、ご本人様の同意を得ることが困難な場合</p>
        <p>5).国の機関もしくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ご本人様の同意を得ることによって当該事務の遂行に支障を及ぼすおそれがある場合</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-4">6. 個人情報の開示等の請求</h2>
        <p>ご本人様は、当社に対してご自身の個人情報の開示等（利用目的の通知、開示、内容の訂正・追加・削除、利用の停止または消去、第三者への提供の停止）に関して、当社問合わせ窓口に申し出ることができます。その際、当社はお客様ご本人を確認させていただいたうえで、合理的な期間内に対応いたします。</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-4">7. 問い合わせ先</h2>
        <p>本サービス、又は個人情報の取扱いに関しては、下記のメールアドレスまでお問い合わせください。</p>
        <p className="mt-2 font-medium">support@withhero.info</p>
      </section>
    </DocumentPage>
  );
}
