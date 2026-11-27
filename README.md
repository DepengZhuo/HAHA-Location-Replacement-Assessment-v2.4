# HAHA 点位替换评估工具

**版本：2.4｜运营商点位替换评估**

本工具面向北美无人零售运营商及 HAHA 销售团队，用于评估现有点位是否适合更换设备，对比现有设备与 HAHA 方案的经营表现，并测算投资、融资、回本周期及压力情景。

本工具是辅助决策模型，不保证未来销售额或利润。所有结果均依赖运营商提供的数据，以及双方确认的规划假设。

> **重要说明：** 本 README 中的增长建议值采用原项目的四象限推荐机制。它们是用于讨论和测算的规划起点，不是行业统计基准，也不是销售承诺。使用前应与运营商核实并调整。

---

## 1. 如何运行项目

### 直接运行已构建文件

使用现代浏览器打开项目根目录下的 `index.html`。该文件已内嵌 CSS 和 JavaScript，也可以直接部署到 GitHub Pages。

### 修改源码后重新构建

源码以 `src/` 目录为准，不建议直接修改根目录生成的 `index.html`。

```bash
python build.py
```

运行核心计算边界测试（需要安装 Node.js，不需要额外第三方依赖）：

```bash
node --test tests/core.test.js
```

构建脚本会把 `src/css/` 和 `src/js/` 中的样式与脚本合并到根目录 `index.html`。

### 数据保存与隐私

- 项目保存在当前浏览器的 `localStorage` 中。
- 工具不会自动把项目数据上传到服务器。
- 清除浏览器数据、更换浏览器或更换设备，不会自动同步项目。
- 使用 **Backup / Export（备份/导出）** 下载 JSON 文件；使用 **Import（导入）** 恢复项目。
- HTML 报告在浏览器本地生成，可通过浏览器打印功能另存为 PDF。
- 导入旧版本项目时会尽量保留已有数据。使用历史项目做新方案前，应重新核对增长假设和成本输入。

---

## 2. 工具流程

| 步骤 | 目的 | 输出 |
|---|---|---|
| 01 · 点位评估 | 记录现有设备状况及可观察到的商业信号 | 0–100 分的替换评估优先级 |
| 02 · 经营与财务分析 | 输入销售、订单、利润、场地合作方式、增长假设、机型和融资条件 | 现有设备与 HAHA 的损益对比、投资、回本、融资和压力测试 |
| 03 · 评估报告 | 汇总输入数据、测算假设、财务对比和后续建议 | 可打印报告及独立 HTML 报告 |

**注意：** 第一步用于判断一个点位是否值得优先进入财务评估，不是直接给出“应该换机”的结论。高分不代表替换一定盈利。是否替换，应以第二步的财务对比为主要依据。

---

# 3. 第一步：点位评估（Location Assessment）

## 3.1 评分结构

```text
总分 = 设备问题（0–40 分）+ 商业信号（0–60 分）
```

只有完成第一步所有必填字段后，才会形成完整评分。

| 分数 | 含义 |
|---:|---|
| 75–100 | 高优先级，建议优先进行财务评估 |
| 50–74 | 可以考虑进入财务评估 |
| 0–49 | 当前紧迫性较低，应先验证商业价值 |

分数区间不会自动决定第二步的增长假设，也不会直接决定最终是否替换。

## 3.2 设备问题：最高 40 分

| 输入项 | 情况 | 分值 |
|---|---|---:|
| 设备使用年限 | 7 年及以上 | 12 |
| | 4 年至不足 7 年 | 6 |
| | 不足 4 年 | 0 |
| 无现金支付能力 | 不支持银行卡，也不支持移动支付 | 12 |
| | 支持银行卡，但不支持移动支付 | 5 |
| | 支持移动支付 | 0 |
| 远程监控 | 没有 | 8 |
| | 有 | 0 |
| 设备状况 | 较差 | 8 |
| | 一般 | 4 |
| | 良好 | 0 |

设备分数最高为 40 分。如果必填字段未填写，第一步保持未完成，不会把缺失信息直接当成确认的 0 分。

支付方式说明：
- `card`：银行卡支付
- `mobile`：移动支付 / 手机钱包
- 现金和纸币支付不计入无现金支付能力。

## 3.3 商业诊断：6 个问题，每题 0 / 5 / 10 分

六个问题分为两类：前三项关注销售增长机会，后三项关注运营摩擦和点位风险。

| 题目 | 维度 | 10 分 | 5 分 | 0 分 |
|---:|---|---|---|---|
| Q1 | 商品组合限制 | 现有设备明显无法销售顾客实际需要的商品类型、尺寸或温度品类 | 有部分商品需求受到限制 | 没有明显限制 |
| Q2 | 多件购买需求 | 顾客明显希望一次购买多件商品，但现有设备难以满足 | 有一些迹象，但不频繁 | 几乎没有未满足的多件购买需求 |
| Q3 | 周边购买便利性 | 周边缺少方便购买食品饮料的渠道 | 有替代渠道，但便利性有限 | 周边有很多方便的替代渠道 |
| Q4 | 运营工作量 | 补货、现场检查、重复维修或设备问题造成大量额外工作 | 存在一些重复性工作 | 额外工作很少 |
| Q5 | 点位留存风险 | 有明确迹象，例如物业提出升级要求、服务投诉或竞争对手已接洽 | 有可能，但尚未确认 | 没有明显风险迹象 |
| Q6 | 设备问题造成的订单损失 | 故障、停机或支付问题已经造成订单损失或顾客投诉 | 有一些可衡量的影响 | 没有已知影响 |

### 判断依据

- **Q1：** 询问运营商是否有想卖但受限于设备容量、商品尺寸、温度或设备形态而无法上架的商品。不要直接把所有零食或罐装饮料判断为低毛利。
- **Q2：** 优先参考每单商品件数、顾客反馈或现场观察。客单价（AOV）本身不能说明一单买了几件商品。
- **Q3：** 考虑实际步行距离、出入便利性、营业时间和周边替代渠道，不要只看附近有没有 24 小时便利店。
- **Q4：** 评估实际发生的运营工作，而不是仅仅因为没有远程监控就给高分。可以考虑不必要的上门检查、低效补货、重复维修和问题处理。
- **Q5：** 依据可观察的事实，不要仅凭销售人员猜测竞争对手可能抢走点位。
- **Q6：** 评估设备问题已经造成的实际经营影响。设备年限和支付能力已经在设备评分中单独考虑，不要只因设备老旧或缺少某项功能就重复加分。

商业评分为 Q1–Q6 之和，最高 60 分。

## 3.4 第一步必填项

进入第二步前，必须填写：

- 点位名称
- 设备使用年限
- 设备状况
- 是否支持远程监控
- 至少一种支付方式
- 六道商业诊断题全部作答

---

# 4. 第二步：经营与财务分析

## 4.1 现有设备经营基线

需要输入：
- 现有设备月销售额
- 现有设备月订单数
- 当前利润录入方式及对应数值
- 当前场地合作方式（流水分成、固定租金、两者结合或无场地费用）

所有月订单换算统一按 **30 天** 计算：

```text
现有设备日均订单 = 月订单数 ÷ 30
现有设备客单价 AOV = 月销售额 ÷ 月订单数
```

AOV 指每笔订单的平均销售金额，不等于每单商品件数。

如果运营商不知道月订单数，工具可以按以下公式估算：

```text
估算月订单数 = 月销售额 ÷ $2.50
```

该估算基于假设客单价为 $2.50，仅供初步测算。报告会标记订单数据为估算值；有条件时应替换为后台实际订单数据。

### 现有设备利润的三种录入方式

**A. 直接填写实际月净利润**

```text
现有设备月净利润 = 用户填写的实际月净利润
现有设备总成本 = 月销售额 − 月净利润
```

实际净利润应已包含所有运营成本。使用此方式时，不要再重复扣除场地费或其他费用。

**B. 按净利率估算**

```text
现有设备月净利润 = 月销售额 × 预估净利率
现有设备总成本 = 月销售额 − 月净利润
```

计算时净利率会被限制在 0%–100%。

**C. 按成本明细计算**

```text
商品成本 COGS = 月销售额 × 商品成本率
场地费 = 月销售额 × 流水分成比例 + 固定租金
支付手续费 = 月销售额 × 无现金支付占比 × 刷卡费率

现有设备总成本 = 商品成本 + 场地费 + 支付手续费
               + 读卡器费用 + 平台费用 + 其他运营成本

现有设备月净利润 = 月销售额 − 现有设备总成本
```

无现金支付占比是用于计算支付手续费的参数，不是单独的一项成本。

“其他运营成本”应包含尚未在其他字段列出的费用，例如补货人工、维修、交通和其他运营开支。不要重复计算场地费或刷卡手续费。

如果填写的实际净利润高于月销售额，工具会提示确认数据是否使用了相同的统计周期和会计口径，不会擅自修改用户输入。

## 4.2 场地合作方式

现有点位合作方式可以选择：
- 按流水分成
- 固定租金
- 流水分成 + 固定租金
- 无场地费用

```text
场地费 = 月销售额 × 流水分成比例 + 固定租金
```

只有当前合作方式启用的费用项才会参与计算。

默认情况下，HAHA 方案沿用现有设备的场地合作方式。如果启用场地条件覆盖，则 HAHA 方案改用单独填写的 HAHA 分成比例和/或租金。

## 4.3 客户认可的增长预期（Client-Agreed Growth Uplift）

本模块有四项增长驱动：

| 增长驱动 | 类型 | 代表的经营改善 |
|---|---|---|
| 商品品类扩展（Product Variety） | 订单增长 | 增加顾客需要的商品，吸引更多订单 |
| 多件购买 / 客单价提升（Basket Size） | 客单价增长 | 顾客每笔订单购买更多商品或更高金额的组合 |
| 减少缺货（Reduced Stockouts） | 订单增长 | 提高商品可售率，挽回因缺货流失的订单 |
| 支付体验改善（Payment Experience） | 订单增长 | 让支付更方便，减少顾客放弃购买 |

### 推荐值如何产生

建议恢复原项目的四象限推荐机制：根据现有月销售额和第一步评估分数，提供一组初始建议值。

象限判断规则：

```text
高销售额：现有月销售额 ≥ $1,200
高评估分：第一步总分 ≥ 50

象限 1：高销售额 + 高评估分
象限 2：高销售额 + 低评估分
象限 3：低销售额 + 高评估分
象限 4：低销售额 + 低评估分
```

推荐表中的数值是“完全认可（Yes）”时的参考上限。默认选择“部分认可（Tentative）”，按参考值的 50% 作为初始建议值。

| 象限 | 商品品类扩展 | 多件购买 / 客单价 | 减少缺货 | 支付体验改善 |
|---|---:|---:|---:|---:|
| 象限 1 | 12% | 10% | 8% | 5% |
| 象限 2 | 7% | 5% | 5% | 3% |
| 象限 3 | 10% | 8% | 7% | 4% |
| 象限 4 | 4% | 3% | 3% | 2% |

**默认“部分认可”对应的建议值：**

| 象限 | 商品品类扩展 | 多件购买 / 客单价 | 减少缺货 | 支付体验改善 |
|---|---:|---:|---:|---:|
| 象限 1 | 6% | 5% | 4% | 2.5% |
| 象限 2 | 3.5% | 2.5% | 2.5% | 1.5% |
| 象限 3 | 5% | 4% | 3.5% | 2% |
| 象限 4 | 2% | 1.5% | 1.5% | 1% |

三种客户确认状态的含义：

- **Yes / 已认可：** 使用该象限完整参考值（100%）。
- **Tentative / 部分认可：** 使用参考值的 50%，作为保守的初始规划值。
- **No / 不认可：** 该项增长按 0% 计算。

运营商可以直接修改百分比。手动修改后的数字应作为自定义假设处理，并在报告中明确标记。

> **特别说明：** 四象限推荐值是项目内部的规划假设，用于让销售与运营商有一个可讨论、可调整的起点；它们不是来自独立行业统计的平均增长率。不能把建议值描述成“行业通常能增长这么多”，也不能将其当成保证结果。

### 增长上限

三项订单增长驱动合并计算，最高为 40%：

```text
订单原始增长率 = 商品品类扩展 % + 减少缺货 % + 支付体验改善 %

最终订单增长率 = min(订单原始增长率, 40%)
```

如果三项相加超过 40%，系统按比例缩减每一项：

```text
比例缩放系数 = 40% ÷ 订单原始增长率
每项实际采用增长率 = 每项输入增长率 × 比例缩放系数
```

多件购买 / 客单价增长单独限制在 25%：

```text
最终客单价增长率 = min(输入的客单价增长率, 25%)
```

### 预测销售额

```text
预测月订单数 = 现有月订单数 × (1 + 最终订单增长率)

预测客单价 = 现有客单价 × (1 + 最终客单价增长率)

预测月销售额 = 预测月订单数 × 预测客单价
```

订单增长和客单价增长会复合计算，因此最终销售额增长率可能高于各项输入百分比的简单相加。

三项订单增长驱动的收入影响，以现有销售额为基数，并使用比例缩放后的增长率计算。客单价增长带来的收入影响，则按预测订单数乘以客单价变化计算。

## 4.4 自动推荐机型

自动推荐机型以 **当前实际日均订单量** 为依据，不以预测订单量作为自动升档依据。

```text
当前日均订单 = 当前月订单数 ÷ 30
```

普通（非冷冻）设备的推荐规则：

| 当前日均订单 | 自动推荐机型 |
|---:|---|
| 少于 10 单 | Mini 360 |
| 10 至不足 18 单 | Plus 440 |
| 18 至不足 35 单 | Pro 542 |
| 35–55 单（含 55） | Max 660 或 Max 620S |
| 超过 55 单 | Ultra 1200 |

边界规则：
- 10 单/天进入 Plus 440。
- 18 单/天进入 Pro 542。
- 35 单/天进入 Max 档。
- 55 单/天仍属于 Max 档。
- 超过 55 单/天才进入 Ultra 1200。

35–55 单/天的机型选择：
- **Max 620S（广告屏版）：** 酒店、医院、交通枢纽、健身房和高端办公室等场景。
- **Max 660：** 其他场景。

如果现有设备类型选择为 `frozen`，则优先推荐 Freezer 550，不受普通机型订单阈值影响。如果冷冻点位当前日均订单少于 15 单，工具会提示重新核实回本周期。

用户可以手动选择其他机型。报告会区分：
- **系统自动推荐机型：** 根据当前实际日均订单量和场景得出。
- **当前选择机型：** 实际用于投资金额计算的机型。

预测订单量对应的容量档位会单独显示为容量规划提示，不会自动修改推荐机型。它的作用是提醒销售和运营商核实高峰需求，而不是强行升级设备。

## 4.5 HAHA 月度经营利润

HAHA 方案使用上面计算得到的预测月销售额和预测月订单数。

```text
HAHA 商品成本 = 预测销售额 × HAHA 商品成本率
HAHA 场地分成 = 预测销售额 × HAHA 流水分成比例
HAHA 场地费 = HAHA 场地分成 + HAHA 固定租金
HAHA 支付手续费 = 预测销售额 × 支付手续费率
HAHA 货损准备 = 预测销售额 × 货损 / 变质比例
HAHA 固定成本 = SaaS + SIM + POS + 维护准备金 + 其他成本
HAHA AI 费用 = 预测月订单数 × 单笔 AI 费用

HAHA 总成本 = 商品成本 + 场地费 + 支付手续费 + 货损准备
            + 固定成本 + AI 费用

HAHA 月净利润 = 预测销售额 − HAHA 总成本
月利润增量 = HAHA 月净利润 − 现有设备月净利润
```

新项目的默认参数：

| 参数 | 默认值 |
|---|---:|
| HAHA 商品成本率 | 45% |
| 支付手续费率 | 5.95% |
| 货损 / 变质比例 | 1.5% |
| SaaS | $15/月 |
| SIM | $15/月 |
| POS | $10/月 |
| 维护准备金 | $15/月 |
| AI 费用 | $0.05/单 |
| 其他运营成本 | $0/月 |

以上均为可编辑的规划输入，不代表所有客户都适用，也不构成价格或成本保证。向客户提交方案前，应确认适用的商务条款和实际运营成本。除非运营商确认确实没有额外成本，否则不要未经核实就把“其他运营成本”留为 0。

当前模型不包含广告收入。

## 4.6 投资金额

```text
设备金额 = 当前选择机型的 MSRP
运费 = 启用运费选项时为 $250，否则为 $0
净投资额 = 设备金额 + 运费 + 安装费 + 拆除费 − 旧机抵扣
```

净投资额不会低于 0。

项目内机型 MSRP 默认值：

| 机型 | MSRP |
|---|---:|
| Mini 360 | $2,999 |
| Plus 440 | $3,499 |
| Pro 542 | $4,499 |
| Max 620S | $5,499 |
| Max 660 | $5,099 |
| Ultra 1200 | $6,999 |
| Freezer 550 | $4,999 |

报价前请确认最新机型价格、运费、安装费、拆除费和旧机抵扣金额。

## 4.7 回本周期与投资回报

工具展示两种回本周期，它们回答的问题不同：

```text
设备独立回本周期 = 净投资额 ÷ HAHA 月净利润

替换增量回本周期 = 净投资额 ÷ 月利润增量
```

- 设备独立回本周期：只看 HAHA 设备自身的月净利润，需要多久覆盖投资。
- 替换增量回本周期：看相较于保留现有设备，每月多赚的钱需要多久覆盖投资。评估“是否值得替换”时，这个指标更重要。

如果分母为 0 或负数，对应回本周期显示为不可回本 / 不适用。

```text
年度利润增量 = 月利润增量 × 12

三年净收益 = 月利润增量 × 36
           − 净投资额
           − 36 个月内的融资成本

三年 ROI = 三年净收益 ÷ 净投资额 × 100%
```

如果净投资额为 0，为避免除以 0，显示 ROI 为 0%。

## 4.8 融资测算

融资输入项：
- 首付比例（默认 10%）
- 贷款期限（默认 12 个月，工具范围 1–24 个月）
- APR 年利率（默认 0%）
- 文件手续费（默认 $50）

```text
首付金额 = 净投资额 × 首付比例
贷款本金 = 净投资额 − 首付金额
月供 = 根据贷款本金、APR 和期限计算的等额月供
签约时现金支出 = 首付金额 + 文件手续费
总支付金额 = 首付金额 + 文件手续费 + 月供 × 期限
融资利息 = 月供 × 期限 − 贷款本金
```

APR 为 0% 时：

```text
月供 = 贷款本金 ÷ 贷款期限
```

文件手续费在签约时支付，不计入贷款本金。

```text
月供覆盖倍数 = HAHA 月净利润 ÷ 月供
支付月供后现金 = HAHA 月净利润 − 月供
相对现有设备的现金差额 = 支付月供后现金 − 现有设备月净利润
```

只有同时满足以下条件，才显示“可由经营现金流覆盖月供”的提示：
- 已启用融资。
- 月供大于 0。
- HAHA 月净利润能够覆盖月供。
- 月利润增量为正。
- 支付月供后的现金不低于现有设备月净利润。

三年净收益中计入的融资成本，为前 36 个月内实际支付的利息加文件手续费。

## 4.9 压力测试

压力测试按预测销售额和预测订单量的 100%、80%、60% 三种情景进行测算。

每种情景的计算：

```text
压力情景销售额 = 预测销售额 × 情景比例
压力情景订单数 = 预测订单数 × 情景比例

压力情景净利润 = 压力情景销售额
                − 压力情景销售额 × 可变成本率
                − 固定成本
                − 压力情景订单数 × AI 单笔费用

压力情景利润差 = 压力情景净利润 − 现有设备月净利润
压力情景增量回本 = 净投资额 ÷ 压力情景利润差
```

可变成本率包含：
- 商品成本
- 场地流水分成
- 支付手续费
- 货损 / 变质

固定成本包含每月固定运营费用及固定场地租金。

压力测试表同时展示 HAHA 月净利润及其相对于现有设备的利润差。利润差为负数，意味着该压力情景下的经营表现低于保留现有设备。

## 4.10 最终结论规则

最终结论综合考虑数据完整性、月利润增量、增量回本周期、相对收益，以及启用融资时的月供覆盖倍数。

| 结论 | 条件 |
|---|---|
| Strong（较强） | 有完整数据；月利润增量 > 0；增量回本 ≤ 24 个月；相对收益 ≥ 20%；若启用融资，月供覆盖倍数 ≥ 1.5 倍 |
| Positive（积极） | 有完整数据；月利润增量 > 0；增量回本 ≤ 36 个月；若启用融资，月供覆盖倍数 ≥ 1.2 倍 |
| Conditional（有条件可行） | 有完整数据；月利润增量 > 0；增量回本 ≤ 48 个月，但未达到更高等级条件 |
| Defer（暂缓） | 其他情况，包括月利润增量不为正 |

相对收益的计算：

```text
如果现有设备月净利润 > 0：
  相对收益 = 月利润增量 ÷ 现有设备月净利润

如果现有设备月净利润 ≤ 0：
  月利润增量 ≥ $200 时，相对收益按 100% 处理；
  否则按 0% 处理。
```

最终结论是根据输入数据和假设得出的模型结果，不是对实际经营结果的承诺，也不能替代运营商核实。

---

# 5. 第三步：评估报告

面向客户的报告包含：
- 点位和现有设备概况
- 第一步评分及诊断依据
- 当前选择机型和系统自动推荐机型
- 增长假设及最终采用比例
- 现有设备与 HAHA 的月订单、客单价、销售额、成本和利润对比
- 月利润增量
- 投资及融资摘要
- 压力测试，包括相对于现有设备的利润差
- 评估结论和建议的后续动作
- 计算方法和限制说明

报告可直接打印或通过浏览器另存为 PDF，也可以下载为独立 HTML 文件。

---

# 6. 重要假设与限制

1. 月订单换算日均订单统一使用 30 天。
2. 现有订单数和现有销售额作为经营基线。
3. 增长建议值是讨论起点，必须与运营商确认后再作为客户认可的预测假设。
4. 增长假设属于规划情景，不是销售承诺。
5. 模型不包含广告收入。
6. 除非用户在输入字段中体现，模型不会自动计入税费、库存周转资金、折旧或设备残值。
7. 设备维修和停机的实际影响取决于设备状况及维护记录，工具不会为该风险擅自指定一个固定美元金额。
8. 对外分享报告前，应核实真实商务条款、手续费、商品成本和运营费用。
9. 第一步评分高，不能推翻第二步不利的财务结果。
10. 导入旧项目会保留原有数值。将旧项目用于新客户方案前，应重新检查增长比例和成本假设。

---

# 7. 项目文件结构

```text
src/
  index.html
  css/
    base.css
    layout.css
    controls.css
    views.css
    report.css
    components.css
    responsive.css
    print.css
  js/
    config.js       机型列表、项目默认值、费用和融资辅助函数
    utils.js        格式化、DOM 辅助和下载工具
    i18n.js         英文和中文界面文案
    store.js        本地存储、数据结构兼容、备份和导入
    calc.js         评分、财务模型、机型推荐和数据校验
    ui-shell.js     页面框架、导航、弹窗和存储提示
    ui-pages.js     首页和项目列表
    ui-step1.js     第一点位评估
    ui-step2.js     第二步经营与财务分析
    ui-report.js    可打印 / 可下载报告
    sync.js         实时计算结果和推荐内容同步
    events.js       用户交互和文件导入导出
    boot.js         应用启动和页面挂载
build.py            单文件 HTML 构建脚本
tests/core.test.js  核心计算和边界测试（Node.js 内置测试运行器）
index.html          构建生成的部署文件
README.md           项目说明文档
```

---

## 8. 版本 2.4 修改记录

- 自动推荐机型改为使用当前实际日均订单量，不再使用预测订单量自动升档。
- 预测订单量单独显示为容量规划提示。
- 第一步诊断题调整为关注运营商可观察到的实际情况，减少主观推测和硬件评分重复。
- 第一步评分定位为财务评估优先级，不再直接代表应该替换。
- Max 620S 标签改为 **Ad Screen（广告屏版）**，不再使用 Flagship。
- 删除缺乏依据的固定金额维修风险提示。
- 运营成本输入明确提醒补货人工、上门检查、清洁及其他费用。
- 报告区分当前选择机型和系统自动推荐机型。
- 压力测试增加相对于现有设备的利润差。
- 增加现有设备净利润高于销售额、预测容量高于当前推荐档位等提示。
- 保留原有三步流程、机型目录、本地保存、导入导出、融资、现金流图表、中英文界面及 HTML / 打印报告功能。

**增长假设说明：** 如果按本说明恢复原四象限推荐机制，新项目默认采用“部分认可（Tentative）”的建议值；用户仍可逐项改为完全认可、不认可或自定义百分比。建议值仅为规划参考，不是行业基准。


# HAHA Location Replacement Assessment

**Version: 2.4 · Operator Replacement Assessment**

A browser-based assessment tool for North American vending operators and HAHA sales teams. It helps evaluate whether an existing vending location is a reasonable candidate for equipment replacement, compare the current machine with a proposed HAHA setup, and review investment, financing, and downside scenarios.

The tool is a decision-support model, not a guarantee of future sales or profit. It must be completed with operator-provided operating data and explicitly agreed assumptions.

## 1. Run the project

### Use the ready-to-deploy file

Open the root `index.html` in a modern browser. It is a self-contained HTML file and can also be hosted on GitHub Pages.

### Build after editing source

The source of truth is `src/`. Do not edit the generated root `index.html` directly.

```bash
python build.py
```

Run the calculation boundary tests with Node.js (no third-party packages required):

```bash
node --test tests/core.test.js
```

The build script inlines all CSS and JavaScript from `src/css/` and `src/js/` into the root `index.html`.

### Data and privacy

- Projects are stored in the current browser's `localStorage`.
- The app does not upload project data to a server.
- Clearing browser data, changing browsers, or changing devices does not transfer projects.
- Use **Backup / Export** to download JSON files and **Import** to restore them.
- HTML reports are generated locally in the browser. The browser's print dialog can be used to save a PDF.
- Imported legacy projects retain their saved values. Review their growth assumptions before relying on their forecasts.

## 2. Workflow overview

| Step | Purpose | Output |
|---|---|---|
| 01 · Location Assessment | Record current machine condition and observable commercial signals | 0–100 replacement-priority score |
| 02 · Operating & Financial Analysis | Enter actual sales, orders, profit, site terms, agreed growth assumptions, model, and financing | Current-vs-HAHA P&L, investment, payback, financing, and stress test |
| 03 · Assessment Report | Summarize the inputs, assumptions, financial comparison, and next steps | Printable report and standalone HTML report |

**Important:** Step 01 is a prioritization screen, not a replacement recommendation. A high score does not prove that replacement is profitable. The financial comparison in Step 02 is the decision point.

---

# 3. Step 01 — Location assessment

## 3.1 Score structure

```text
Total score = Hardware pain (0–40) + Commercial signals (0–60)
```

The score is only available after all required Step 01 fields are completed.

| Score | Interpretation |
|---:|---|
| 75–100 | High priority for financial review |
| 50–74 | Consider financial review |
| 0–49 | Lower urgency; validate the business case first |

These bands do not automatically determine the Step 02 growth assumptions or the final replacement verdict.

## 3.2 Hardware pain — maximum 40 points

| Input | Answer | Points |
|---|---|---:|
| Machine age | 7 years or older | 12 |
| | 4 to under 7 years | 6 |
| | Under 4 years | 0 |
| Cashless payment | No card and no mobile payment | 12 |
| | Card accepted, but no mobile payment | 5 |
| | Mobile payment accepted | 0 |
| Remote monitoring | No | 8 |
| | Yes | 0 |
| Physical condition | Poor | 8 |
| | Fair | 4 |
| | Good | 0 |

The hardware score is capped at 40. If the operator has not entered a required field, Step 01 remains incomplete rather than treating the missing answer as a confirmed zero.

Payment scoring uses the payment options recorded in the project:
- `card` = card payment
- `mobile` = mobile / wallet payment
- Coin and bill acceptance do not count as cashless payment.

## 3.3 Commercial diagnosis — six questions, 10 / 5 / 0 points each

The six questions are split into three offensive signals (potential to grow sales) and three defensive signals (operating friction or location risk).

| # | Dimension | 10 points | 5 points | 0 points |
|---:|---|---|---|---|
| Q1 | Product mix constraints | Current machine clearly prevents products customers want because of product type, size, or temperature limits | Some demanded products are restricted | No meaningful product restrictions |
| Q2 | Unmet multi-item demand | Customers show clear demand to buy multiple items together, but the current machine makes it difficult | Some evidence, but not frequent | Little evidence of unmet multi-item demand |
| Q3 | Nearby purchase convenience | Convenient food and beverage alternatives are limited | Some alternatives exist, but convenience is still limited | Many convenient alternatives |
| Q4 | Operating workload | Restocking, on-site checks, repeat maintenance, or machine issues create substantial work | Some recurring workload | Little additional workload |
| Q5 | Location retention risk | Concrete signals exist: property upgrade request, service complaint, or competitor already approaching | Possible but unconfirmed risk | No meaningful evidence of risk |
| Q6 | Lost purchases from equipment issues | Failures, downtime, or payment problems have already caused lost purchases or complaints | Some measurable impact | No known impact |

### Evidence guidance

- **Q1:** Ask which products the operator wants to sell but cannot stock because of capacity, product dimensions, temperature, or machine format. Do not assume all snacks or canned drinks are low-margin.
- **Q2:** Prefer items-per-transaction data, customer feedback, or direct observation. Average order value (AOV) alone does not tell you the number of items in a basket.
- **Q3:** Consider actual walking distance, access, hours, and availability of nearby alternatives. Do not restrict the question to 24-hour convenience stores.
- **Q4:** Score the operating work that is actually occurring, not the mere absence of remote monitoring. Include unnecessary site visits, restocking inefficiency, repeated maintenance, and issue handling.
- **Q5:** Use observable evidence, not a salesperson's guess that a competitor might take the location.
- **Q6:** Score the business consequence already experienced. Machine age and payment capability are separately covered in the hardware score; do not award points here based only on age or missing features.

The commercial score is the sum of Q1–Q6, capped at 60.

## 3.4 Required Step 01 fields

To continue to Step 02, the user must enter:

- Location name
- Machine age
- Machine condition
- Remote monitoring status
- At least one payment method
- An answer to all six commercial questions

---

# 4. Step 02 — Operating and financial analysis

## 4.1 Current-machine baseline

Required inputs:
- Current monthly sales
- Current monthly order count
- Current profit-entry method and the corresponding value
- Current location agreement (revenue share, fixed rent, combination, or none)

All monthly order calculations use a **30-day month**:

```text
Current daily orders = Current monthly orders ÷ 30
Current AOV = Current monthly sales ÷ Current monthly orders
```

AOV is average sales dollars per order. It is not average items per order.

If the operator does not know monthly order count, the app can estimate it using:

```text
Estimated monthly orders = Monthly sales ÷ $2.50
```

This is only an estimate based on a $2.50 assumed AOV. The report marks estimated order data. Replace it with actual backend order data when available.

### Current-machine profit methods

**A. Actual monthly net profit**

```text
Current net profit = User-entered actual monthly net profit
Current costs = Current sales − Current net profit
```

The actual net profit should already include all operating costs. Do not deduct site fees or other expenses again in this method.

**B. Estimated net margin**

```text
Current net profit = Current sales × Estimated net margin %
Current costs = Current sales − Current net profit
```

The margin is constrained to 0–100% by the calculation.

**C. Cost detail**

```text
COGS = Current sales × COGS %
Site fee = Current sales × Revenue-share % + Fixed rent
Card processing = Current sales × Cashless share % × Card fee %
Current costs = COGS + Site fee + Card processing
              + Reader fee + Platform fee + Other operating costs
Current net profit = Current sales − Current costs
```

The cashless share is a driver used to calculate card processing; it is not a separate cost.

The Other operating costs field should include relevant costs not already listed, such as restocking labor, repairs, travel, and other operating expenses. Do not double-count site fees or card fees.

If entered actual net profit exceeds monthly sales, the app displays a warning to confirm that the figures use the same period and accounting basis. It does not silently change the user's input.

## 4.2 Site agreement

The current location agreement can be:
- Revenue share
- Fixed rent
- Revenue share + fixed rent
- No site fee

```text
Site fee = Monthly sales × Revenue-share % + Fixed rent
```

Only the active agreement components are included.

By default, the HAHA scenario uses the same site agreement as the current machine. If the user enables the agreement override, the HAHA scenario uses the separately entered HAHA share and/or rent.

## 4.3 Growth assumptions — zero by default

The app contains four optional growth drivers:

| Driver | Type | What it represents |
|---|---|---|
| Product variety | Order growth | More relevant products can attract additional orders |
| Basket size | AOV growth | Customers buy more items or higher-value combinations per order |
| Reduced stockouts | Order growth | Better availability may recover missed orders |
| Payment experience | Order growth | Easier payment may reduce abandoned purchases |

**Default assumption for all four drivers is 0%.** The user must enter a percentage explicitly. The acceptance selector records whether an assumption is agreed, tentative, or not agreed; selecting a status does not automatically generate a growth percentage.

If the user manually enters a percentage, the report labels that percentage as **Custom**.

### Growth caps

Three order-growth drivers are combined and capped at 40%:

```text
Raw order growth = Variety % + Reduced-stockout % + Payment %
Applied order growth = min(Raw order growth, 40%)
```

If the raw total exceeds 40%, each order-growth driver is reduced proportionally:

```text
Pro-rata scale factor = 40% ÷ Raw order growth
Applied driver % = Entered driver % × Pro-rata scale factor
```

Basket-size growth is capped separately at 25%:

```text
Applied AOV growth = min(Entered basket-size growth, 25%)
```

### Projected sales

```text
Projected monthly orders = Current monthly orders × (1 + Applied order growth)
Projected AOV = Current AOV × (1 + Applied AOV growth)
Projected monthly sales = Projected monthly orders × Projected AOV
```

Because order growth and AOV growth compound, total sales growth can be greater than the sum of the entered percentages.

The revenue impact shown for the three order drivers is based on the current sales baseline and their pro-rata-adjusted percentages. Basket-size revenue impact is calculated using projected order count multiplied by the change in AOV.

## 4.4 Automatic model recommendation

Automatic recommendation is based on **current observed daily orders**, not projected orders. Forecast orders are shown separately as a capacity-planning signal and do not automatically upgrade the recommended model.

```text
Current daily orders = Current monthly orders ÷ 30
```

For non-frozen machine types:

| Current daily orders | Automatic recommendation |
|---:|---|
| Under 10 | Mini 360 |
| 10 to under 18 | Plus 440 |
| 18 to under 35 | Pro 542 |
| 35 through 55 | Max 660 or Max 620S |
| Above 55 | Ultra 1200 |

Boundary rules:
- 10 orders/day enters Plus 440.
- 18 orders/day enters Pro 542.
- 35 orders/day enters the Max tier.
- 55 orders/day remains in the Max tier.
- More than 55 orders/day enters Ultra 1200.

For the 35–55 orders/day tier:
- **Max 620S (Ad Screen):** hotel, hospital, transit, gym, and premium office venues.
- **Max 660:** other venue types.

If the existing machine type is recorded as `frozen`, Freezer 550 takes priority over the order thresholds. If a frozen location has fewer than 15 current orders/day, the app displays a low-volume warning to validate payback.

The user may manually select a different model. The report distinguishes:
- **Automatically Recommended Model:** based on current observed daily orders and venue.
- **Selected Model:** the model actually used for investment calculations.

The forecast-capacity warning compares the current-demand recommendation with the model tier implied by projected orders. It is a prompt to validate peak demand, not an automatic model change.

## 4.5 HAHA monthly operating profit

The HAHA scenario uses the projected monthly sales and orders calculated above.

```text
HAHA COGS = Projected sales × HAHA COGS %
HAHA site share = Projected sales × HAHA revenue-share %
HAHA site fee = HAHA site share + HAHA fixed rent
HAHA processing = Projected sales × Processing fee %
HAHA shrinkage = Projected sales × Shrinkage / spoilage %
HAHA fixed costs = SaaS + SIM + POS + Maintenance + Other
HAHA AI fee = Projected monthly orders × AI fee per order

HAHA total costs = COGS + Site fee + Processing + Shrinkage
                 + Fixed costs + AI fee

HAHA monthly net profit = Projected sales − HAHA total costs
Incremental monthly profit = HAHA monthly net profit − Current monthly net profit
```

The default model parameters in a new project are:

| Parameter | Default |
|---|---:|
| HAHA COGS rate | 45% |
| Payment processing rate | 5.95% |
| Shrinkage / spoilage | 1.5% |
| SaaS | $15/month |
| SIM | $15/month |
| POS | $10/month |
| Maintenance reserve | $15/month |
| AI fee | $0.05/order |
| Other operating costs | $0/month |

These are editable planning inputs, not universal costs or guarantees. Confirm the applicable commercial terms and actual operating costs before presenting a customer proposal. The Other operating costs field should not remain at zero unless the operator has confirmed that no additional costs apply.

The default model does not include advertising revenue.

## 4.6 Investment

```text
Equipment cost = Selected model MSRP
Freight = $250 if the freight option is enabled; otherwise $0
Net investment = Equipment + Freight + Installation + Removal − Trade-in
```

The app prevents net investment from falling below zero.

Default model MSRP values in the project:

| Model | MSRP |
|---|---:|
| Mini 360 | $2,999 |
| Plus 440 | $3,499 |
| Pro 542 | $4,499 |
| Max 620S | $5,499 |
| Max 660 | $5,099 |
| Ultra 1200 | $6,999 |
| Freezer 550 | $4,999 |

Confirm current pricing, freight, installation, removal, and trade-in values before quoting.

## 4.7 Payback and return

Two payback metrics are shown because they answer different questions:

```text
Standalone payback = Net investment ÷ HAHA monthly net profit
Incremental payback = Net investment ÷ Incremental monthly profit
```

- Standalone payback asks how long the HAHA machine's own net profit would take to cover the investment.
- Incremental payback asks how long the additional profit from replacing the current machine would take to cover the investment. This is the more relevant replacement comparison.

If the denominator is zero or negative, the corresponding payback is shown as unavailable / no payback.

```text
Annual incremental profit = Incremental monthly profit × 12

Three-year net gain = Incremental monthly profit × 36
                    − Net investment
                    − Financing cost within 36 months

3-year ROI = Three-year net gain ÷ Net investment × 100%
```

If net investment is zero, the displayed ROI is set to 0% to avoid division by zero.

## 4.8 Financing

Financing inputs:
- Down payment percentage (default 10%)
- Term (default 12 months; app range 1–24 months)
- APR (default 0%)
- Documentation fee (default $50)

```text
Down payment = Net investment × Down payment %
Principal = Net investment − Down payment
Monthly payment = Amortized payment on principal, APR, and term
Cash due at signing = Down payment + Documentation fee
Total paid = Down payment + Documentation fee + Monthly payment × Term
Financing interest = Monthly payment × Term − Principal
```

For 0% APR:

```text
Monthly payment = Principal ÷ Term
```

The documentation fee is paid at signing and is not included in the loan principal.

```text
Monthly payment coverage = HAHA monthly net profit ÷ Monthly payment
Cash after payment = HAHA monthly net profit − Monthly payment
Cash difference vs. current machine = Cash after payment − Current monthly net profit
```

The self-funding indicator is shown only when all conditions are true:
- Financing is enabled.
- Monthly payment is greater than zero.
- HAHA monthly net profit covers the payment.
- Incremental monthly profit is positive.
- Cash after payment is at least the current machine's monthly net profit.

Financing cost included in the 3-year net gain is the interest paid within the first 36 months plus the documentation fee.

## 4.9 Stress test

The stress test models 100%, 80%, and 60% of projected sales and projected orders.

For each scenario:

```text
Stress sales = Projected sales × Scenario %
Stress orders = Projected orders × Scenario %

Stress net profit = Stress sales
                  − Stress sales × Variable cost rate
                  − Fixed costs
                  − Stress orders × AI fee

Stress incremental profit = Stress net profit − Current monthly net profit
Stress incremental payback = Net investment ÷ Stress incremental profit
```

Variable cost rate includes:
- COGS
- Site revenue share
- Payment processing
- Shrinkage / spoilage

Fixed costs include monthly fixed operating costs and fixed site rent.

The stress table shows both HAHA monthly net profit and the difference versus keeping the current machine. A negative difference means the stress scenario performs worse than the current-machine profit baseline.

## 4.10 Final verdict rules

The verdict considers data completeness, incremental profit, incremental payback, relative gain, and (when financing is enabled) payment coverage.

| Verdict | Conditions |
|---|---|
| Strong | Data available; incremental profit > 0; incremental payback ≤ 24 months; relative gain ≥ 20%; and if financed, payment coverage ≥ 1.5× |
| Positive | Data available; incremental profit > 0; incremental payback ≤ 36 months; and if financed, payment coverage ≥ 1.2× |
| Conditional | Data available; incremental profit > 0; incremental payback ≤ 48 months, but the stronger criteria are not met |
| Defer | Other cases, including no positive incremental profit |

Relative gain is calculated as:

```text
If current profit > 0:
  Relative gain = Incremental monthly profit ÷ Current monthly net profit

If current profit ≤ 0:
  Relative gain = 100% when incremental monthly profit ≥ $200;
                  otherwise 0%
```

The verdict is a model output based on the inputs and assumptions. It is not a promise of actual results or a substitute for operator validation.

---

# 5. Step 03 — Report contents

The customer-facing report includes:
- Location and machine overview
- Step 01 score and diagnostic rationale
- Selected model and automatically recommended model
- Growth assumptions and applied percentages
- Current vs. HAHA monthly orders, AOV, sales, costs, and profit
- Incremental monthly profit
- Investment and financing summary
- Stress test, including profit difference versus the current machine
- Decision summary and suggested next steps
- Methodology and limitations

The report can be printed or saved as PDF through the browser print dialog, or downloaded as a standalone HTML file.

# 6. Important assumptions and limitations

1. A 30-day month is used to convert monthly orders to daily orders.
2. Current orders and current sales are treated as the operating baseline.
3. Growth percentages are zero by default and should only be entered after discussion with the operator.
4. Growth assumptions are planning scenarios, not sales commitments.
5. No advertising revenue is included.
6. The model does not automatically include taxes, inventory working capital, depreciation, or resale value unless represented in a user-entered field.
7. Actual machine repair and downtime impact varies by equipment condition and maintenance history. The tool does not assign an unsupported fixed dollar value to this risk.
8. Actual commercial terms, fees, product costs, and operating expenses should be verified before sharing the report.
9. A high Step 01 score does not override an unfavorable financial result.
10. Imported projects retain previously saved values. Review old growth percentages and cost assumptions before using an imported project as a new customer proposal.

# 7. Project structure

```text
src/
  index.html
  css/
    base.css
    layout.css
    controls.css
    views.css
    report.css
    components.css
    responsive.css
    print.css
  js/
    config.js       Model list, default project, fees, financing helpers
    utils.js        Formatting, DOM helpers, download helpers
    i18n.js         English and Chinese UI copy
    store.js        Local storage, schema normalization, backup/import
    calc.js         Scoring, financial model, model recommendation, validation
    ui-shell.js     App shell, navigation, modal, storage warning
    ui-pages.js     Dashboard and project list
    ui-step1.js     Location assessment
    ui-step2.js     Operating and financial analysis
    ui-report.js    Printable / downloadable report
    sync.js         Live output and recommendation synchronization
    events.js       User interaction and file import/export
    boot.js         Startup and view mounting
build.py            Single-file HTML build script
tests/core.test.js  Core calculation and boundary tests (Node.js built-in test runner)
index.html          Generated deployment artifact
README.md           Business logic and operating guide
```

## 8. Version 2.4 change log

- Automatic model recommendation now uses current observed daily orders, not forecast orders.
- Forecast capacity is shown separately as a warning when growth assumptions imply a higher capacity tier.
- New projects start with all four growth assumptions at 0%.
- Acceptance status no longer silently inserts growth percentages; users enter percentages explicitly.
- Manually entered growth percentages are identified as custom assumptions in the report.
- Step 01 diagnostic questions now focus on observable operator evidence and reduce overlap between hardware condition and actual business impact.
- Step 01 score tiers are framed as financial-review priority, not an automatic replacement instruction.
- Max 620S is labeled **Ad Screen**, not Flagship.
- Unsupported fixed-dollar repair-risk claims were removed.
- Operating-cost fields now explicitly prompt users to include restocking labor, site visits, cleaning, and other costs.
- The report distinguishes the selected model from the automatically recommended model.
- Stress-test rows show the profit difference versus the current machine.
- Warnings were added for old-machine net profit exceeding sales and for forecast capacity moving above the current-demand recommendation.
- The original three-step workflow, model catalog, local storage, import/export, financing, cash-flow chart, bilingual UI, and HTML/print reporting are retained.
