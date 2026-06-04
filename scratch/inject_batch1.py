import json

filepath = 'legal-taxation.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We will inject the new articles right after 'incorporated-association'

new_articles = """
    'self-managed-super-fund-smsf': {
        title: 'Self-Managed Super Fund (SMSF)',
        content: `
            <p>A Self-Managed Superannuation Fund (SMSF) is a private superannuation fund that you manage yourself. Unlike retail or industry super funds, SMSFs put you in the driver's seat, allowing you to choose exactly how your retirement savings are invested.</p>
            
            <h3>Key Advantages of an SMSF</h3>
            <ul>
                <li><strong>Investment Control:</strong> You can invest in a broader range of assets, including direct property, physical gold, and collectibles, which are often unavailable in traditional funds.</li>
                <li><strong>Tax Strategies:</strong> SMSFs offer significant flexibility in tax planning, particularly concerning Capital Gains Tax (CGT) exemptions when the fund transitions to the pension phase.</li>
                <li><strong>Business Real Property:</strong> Business owners can purchase commercial property through their SMSF and lease it back to their own business at market rates, effectively paying rent into their own retirement fund.</li>
            </ul>

            <h3>Key Responsibilities and Drawbacks</h3>
            <p>With great power comes great responsibility. Managing an SMSF means you act as the trustee (or director of a corporate trustee), making you personally liable for ensuring the fund complies with strict Superannuation Industry (Supervision) Act (SIS Act) regulations.</p>
            <ul>
                <li><strong>Compliance and Admin Costs:</strong> SMSFs require annual audits, tax returns, and valuations, which can cost thousands of dollars per year regardless of the fund's balance.</li>
                <li><strong>Time Commitment:</strong> You are responsible for researching and managing the investments, which requires financial literacy and ongoing dedication.</li>
                <li><strong>Penalties:</strong> Breaching the rules (e.g., using fund assets for personal benefit) can result in severe penalties, including up to 47% tax on the fund's assets.</li>
            </ul>
        `
    },
    'introduction-to-cgt': {
        title: 'Introduction to Capital Gains Tax (CGT)',
        content: `
            <p>Capital Gains Tax (CGT) is the tax you pay on profits made from selling an asset, such as real estate or shares. In Australia, CGT is not a separate tax; rather, the net capital gain is added to your assessable income in the financial year the asset is sold.</p>
            
            <h3>How CGT Works</h3>
            <p>A capital gain (or loss) occurs when a "CGT event" happens—the most common being the sale of an asset. The gain is calculated as the difference between your <strong>capital proceeds</strong> (what you received) and your <strong>cost base</strong> (what you paid, including incidental costs like stamp duty and legal fees).</p>

            <h3>The 50% CGT Discount</h3>
            <p>If you are an Australian resident individual or trust and you hold an asset for <strong>more than 12 months</strong> before selling it, you are generally eligible for a 50% CGT discount. This means only half of your net capital gain is added to your taxable income. Note that companies are not eligible for this discount.</p>

            <h3>Exemptions</h3>
            <p>Not all assets are subject to CGT. The most significant exemption is your "main residence" (your family home). Personal use assets (like boats or furniture) sold for less than $10,000, and cars are also generally exempt.</p>
        `
    },
    'introduction-to-income-tax': {
        title: 'Introduction to Income Tax',
        content: `
            <p>Income tax is the primary source of revenue for the Australian Government, levied on the taxable income of individuals and corporations. Understanding how it operates is foundational for effective wealth creation and preservation.</p>

            <h3>The Progressive Tax System</h3>
            <p>Australia uses a progressive tax system for individuals, meaning that as your income increases, the rate of tax applied to the higher portions of your income also increases. This is structured through tax brackets, each with a designated marginal tax rate.</p>

            <h3>Taxable Income</h3>
            <p>Your taxable income is your assessable income (salary, wages, rental income, dividends, etc.) minus allowable deductions (expenses incurred to generate that income). Tax is calculated on this final figure.</p>

            <h3>Corporate Tax Rates</h3>
            <p>Unlike individuals, companies in Australia pay a flat rate of tax. For "base rate entities" (smaller companies with aggregated turnover under $50 million), the rate is 25%. For all other companies, the rate is 30%.</p>
        `
    },
    'what-is-estate-planning': {
        title: 'What is Estate Planning?',
        content: `
            <p>Estate planning is the process of arranging the management and disposal of your estate during your life and after death. It ensures your wealth is protected, your healthcare wishes are respected if you lose capacity, and your assets are distributed smoothly to your chosen beneficiaries.</p>

            <h3>Key Components of an Estate Plan</h3>
            <ul>
                <li><strong>Will:</strong> A legal document detailing how your assets will be distributed after your death and appointing an executor to manage the process.</li>
                <li><strong>Enduring Power of Attorney (EPOA):</strong> Appoints someone to make financial and legal decisions on your behalf if you lose mental capacity.</li>
                <li><strong>Advance Health Directive:</strong> Outlines your wishes regarding medical treatment and appoints a decision-maker for health matters if you cannot speak for yourself.</li>
                <li><strong>Binding Death Benefit Nominations (BDBN):</strong> Directs your superannuation fund on who should receive your super balance and life insurance, as super does not automatically form part of your estate.</li>
            </ul>

            <h3>Testamentary Trusts</h3>
            <p>Many robust estate plans include testamentary trusts within the Will. These trusts are created upon your death and can provide significant asset protection for your beneficiaries (e.g., from bankruptcy or divorce) and tax advantages for minor beneficiaries.</p>
        `
    },
    'what-are-directors-duties': {
        title: "What are Directors' Duties?",
        content: `
            <p>Under the Corporations Act 2001 and general law, company directors are subject to strict legal duties. These duties are designed to protect shareholders, creditors, and the public by ensuring directors act honestly and competently.</p>

            <h3>The Core Duties</h3>
            <ul>
                <li><strong>Care and Diligence:</strong> A director must exercise their powers with the degree of care and diligence that a reasonable person would in their position.</li>
                <li><strong>Good Faith and Best Interests:</strong> Directors must act in good faith in the best interests of the company as a whole, not just for their personal gain or for a specific shareholder.</li>
                <li><strong>Improper Use of Position or Information:</strong> Directors must not use their position, or information gained from their position, to gain an advantage for themselves or cause detriment to the company.</li>
                <li><strong>Duty to Prevent Insolvent Trading:</strong> A director must prevent the company from incurring new debts if the company is insolvent or if there are reasonable grounds to suspect it will become insolvent.</li>
            </ul>

            <h3>Consequences of Breaching Duties</h3>
            <p>Breaches can result in severe consequences, including civil penalties, disqualification from managing corporations, personal liability for company debts, and in cases of recklessness or intentional dishonesty, criminal charges and imprisonment.</p>
        `
    },
"""

# Find the insertion point: right after the 'incorporated-association' block
anchor = "'incorporated-association': {"
start_idx = content.find(anchor)
if start_idx != -1:
    # Find the closing brace of 'incorporated-association'
    end_idx = content.find('},', start_idx) + 2
    
    # Inject the new articles
    new_content = content[:end_idx] + "\n" + new_articles + content[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Injected 5 articles into legal-taxation.html")
else:
    print("Could not find insertion anchor!")
