import { ConstantCost, CustomCost, ExponentialCost, FirstFreeCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { QuaternaryEntry, theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "the_cookie_formula";
var name = "Cookie's Theory";
var description = "Calculate the value of tau by using alpha, delta and infinity.";
var authors = "thecoolcookie366";
var version = 6;

var alpha, delta, infinity;
var aleph = BigNumber.ZERO;
var rateAlpha = BigNumber.ZERO;
var rateDelta = BigNumber.ZERO;
var rateInf = BigNumber.ZERO;
var rateAleph = BigNumber.ZERO;
var quaternary = [
    new QuaternaryEntry("\\alpha", null),
    new QuaternaryEntry("\\Delta", null),
    new QuaternaryEntry("\\infty", null),
    new QuaternaryEntry("\\aleph", null),
    new QuaternaryEntry("\\dot{\\alpha}", null),
    new QuaternaryEntry("\\dot{\\Delta}", null),
    new QuaternaryEntry("\\dot{\\infty}", null),
    new QuaternaryEntry("\\dot{\\aleph}", null)
];


var c1, c2, c3, x, y, z, w, q1, q2, q3;
var permMult, permC2Boost, permC3Boost, permDeltaBoost, permInfBoost, permPubBoost, permSynergy, permQBoost, permOverdrive, permAleph;
var expTier, c1Exp, c2Exp, c3Exp, xExp, yExp, zExp, wBoost, deltaAlphaExp, deltaInfExp, infTauBoost, alephMult, alephDeltaExp, qCapBoost, tauExpBoost;

var catAlpha, catDelta, catInfinity, catAleph, catTau, catSecrets;
var achievement1, achievement2, achievement3, achievement4, achievement5, achievement6, achievement7, achievement8, achievement9;
var secretAchievement1, secretAchievement2, secretAchievement3, secretAchievement4;
var chapter1, chapter2, chapter3, chapter4, chapter5;

var init = () => {
    alpha = theory.createCurrency("α", "\\alpha");
    delta = theory.createCurrency("Δ", "\\Delta");
    infinity = theory.createCurrency("∞", "\\infty");
    
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(0, alpha, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    {
        let getDesc = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(1, alpha, new ExponentialCost(25, Math.log2(3.5)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getDesc(c2.level), getDesc(c2.level + amount));
    }

    {
        let getDesc = (level) => "c_3=" + getC3(level).toString(2);
        c3 = theory.createUpgrade(2, alpha, new ExponentialCost(100, Math.log2(6)));
        c3.getDescription = (_) => Utils.getMath(getDesc(c3.level));
        c3.getInfo = (amount) => Utils.getMathTo(getDesc(c3.level), getDesc(c3.level + amount));
    }

    {
        let getDesc = (level) => "x=100^{" + level + "}";
        let getInfo = (level) => "x=" + getX(level).toString(0);
        x = theory.createUpgrade(4, delta, new ExponentialCost(10, Math.log2(1e3)));
        x.getDescription = (_) => Utils.getMath(getDesc(x.level));
        x.getInfo = (amount) => Utils.getMathTo(getInfo(x.level), getInfo(x.level + amount));
    }

    {
        let getDesc = (level) => "y=10^{" + level + "}";
        let getInfo = (level) => "y=" + getY(level).toString(0);
        y = theory.createUpgrade(5, delta, new ExponentialCost(1e3, Math.log2(500)));
        y.getDescription = (_) => Utils.getMath(getDesc(y.level));
        y.getInfo = (amount) => Utils.getMathTo(getInfo(y.level), getInfo(y.level + amount));
    }

    {
        let getDesc = (level) => "z=" + getZ(level).toString(0);
        z = theory.createUpgrade(6, delta, new ExponentialCost(1e6, Math.log2(250)));
        z.getDescription = (_) => Utils.getMath(getDesc(z.level));
        z.getInfo = (amount) => Utils.getMathTo(getDesc(z.level), getDesc(z.level + amount));
    }

    {
        let getDesc = (level) => "w=" + (wBoost.level > 0 ? "3" : "2") + "^{" + level + "}";
        let getInfo = (level) => "w=" + getW(level).toString(0);
        w = theory.createUpgrade(3, delta, new ExponentialCost(1e12, Math.log2(125)));
        w.getDescription = (_) => Utils.getMath(getDesc(w.level));
        w.getInfo = (amount) => Utils.getMathTo(getInfo(w.level), getInfo(w.level + amount));
    }

    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(2);
        q1 = theory.createUpgrade(7, infinity, new ExponentialCost(0.1, Math.log2(1.5)));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
        q1.maxLevel = 50;
    }

    {
        let getDesc = (level) => "q_2=" + getQ2(level).toString(2);
        q2 = theory.createUpgrade(8, infinity, new ExponentialCost(10, Math.log2(2)));
        q2.getDescription = (_) => Utils.getMath(getDesc(q2.level));
        q2.getInfo = (amount) => Utils.getMathTo(getDesc(q2.level), getDesc(q2.level + amount));
        q2.maxLevel = 50;
    }

    {
        let getDesc = (level) => "q_3=" + getQ3(level).toString(2);
        q3 = theory.createUpgrade(9, infinity, new ExponentialCost(1000, Math.log2(3)));
        q3.getDescription = (_) => Utils.getMath(getDesc(q3.level));
        q3.getInfo = (amount) => Utils.getMathTo(getDesc(q3.level), getDesc(q3.level + amount));
        q3.maxLevel = 50;
    }

    theory.createPublicationUpgrade(0, alpha, 1e10);
    theory.createBuyAllUpgrade(1, delta, 1e10);
    theory.createAutoBuyerUpgrade(2, infinity, 1e10);

    {
        permMult = theory.createPermanentUpgrade(3, alpha, new ExponentialCost(1e20, Math.log2(1e5)));
        permMult.maxLevel = 10;
        permMult.getDescription = (_) => "Permanent " + Utils.getMath("10^{" + permMult.level + "}\\times \\alpha\\;\\text{gain}");
        permMult.getInfo = (_) => "Multiplies α production by 10x per level";
    }

    {
        permDeltaBoost = theory.createPermanentUpgrade(6, delta, new ExponentialCost(1e10, Math.log2(1e4)));
        permDeltaBoost.maxLevel = 10;
        permDeltaBoost.getDescription = (_) => "Permanent " + Utils.getMath("5^{" + permDeltaBoost.level + "}\\times \\Delta\\;\\text{gain}");
        permDeltaBoost.getInfo = (_) => "Multiplies Δ production by 5x per level";
    }

    {
        permInfBoost = theory.createPermanentUpgrade(7, infinity, new ExponentialCost(10, Math.log2(10)));
        permInfBoost.maxLevel = 10;
        permInfBoost.getDescription = (_) => "Permanent " + Utils.getMath("2^{" + permInfBoost.level + "}\\times \\infty\\;\\text{gain}");
        permInfBoost.getInfo = (_) => "Multiplies ∞ production by 2x per level";
    }

    {
        permC2Boost = theory.createPermanentUpgrade(4, alpha, new ConstantCost(1e100));
        permC2Boost.maxLevel = 1;
        permC2Boost.getDescription = (_) => "Boost " + Utils.getMath("c_2") + " (" + Utils.getMath("c_2^{1.25}") + ")";
        permC2Boost.getInfo = (_) => "Raises " + Utils.getMath("c_2") + " to " + Utils.getMath("1.25");
    }

    {
        permC3Boost = theory.createPermanentUpgrade(5, alpha, new ConstantCost(1e250));
        permC3Boost.maxLevel = 1;
        permC3Boost.getDescription = (_) => "Boost " + Utils.getMath("c_3") + " (" + Utils.getMath("c_3^{1.25}") + ")";
        permC3Boost.getInfo = (_) => "Raises " + Utils.getMath("c_3") + " to " + Utils.getMath("1.25");
    }

    {
        permPubBoost = theory.createPermanentUpgrade(8, alpha, new ExponentialCost(1e150, Math.log2(1e100)));
        permPubBoost.maxLevel = 5;
        permPubBoost.getDescription = (_) => "Publication Exp +" + (permPubBoost.level * 5);
        permPubBoost.getInfo = (_) => "Increases Publication multiplier exponent by +5 per level";
        permPubBoost.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        permSynergy = theory.createPermanentUpgrade(9, delta, new ConstantCost(1e50));
        permSynergy.maxLevel = 1;
        permSynergy.getDescription = (_) => {
            let exp = permSynergy.level > 0 ? "0.25" : "0.15";
            return "Synergy (" + Utils.getMath("(1+\\Delta)^{" + exp + "}, (1+\\infty)^{" + exp + "}") + ")";
        };
        permSynergy.getInfo = (_) => "Permanently raises Δ and ∞ cascade exponents from 0.15 to 0.25";
        permSynergy.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        permQBoost = theory.createPermanentUpgrade(10, infinity, new ExponentialCost(1e4, Math.log2(50)));
        permQBoost.maxLevel = 5;
        permQBoost.getDescription = (_) => "Exp Enhancer (+" + (permQBoost.level * 0.05).toFixed(2) + " to " + Utils.getMath("q_1,q_2,q_3") + ")";
        permQBoost.getInfo = (_) => "Permanently adds +0.05 to q1, q2, and q3 per level";
    }

    {
        permOverdrive = theory.createPermanentUpgrade(11, alpha, new ExponentialCost(BigNumber.TEN.pow(500), Math.log2(BigNumber.TEN.pow(250))));
        permOverdrive.maxLevel = 10;
        permOverdrive.getDescription = (_) => "Limitless (" + Utils.getMath("10^{" + (permOverdrive.level * 3) + "}\\times") + " " + Utils.getMath("\\alpha") + ")";
        permOverdrive.getInfo = (_) => "Multiplies α production by 1,000x per level";
    }

    {
        let alephCost = BigNumber.from(1e6);
        permAleph = theory.createPermanentUpgrade(12, infinity, new CustomCost((_) => aleph >= alephCost ? BigNumber.ZERO : BigNumber.TEN.pow(BigNumber.TEN.pow(1.7976e308))));
        permAleph.maxLevel = 1;
        permAleph.getDescription = (_) => "Alephing (Cost: " + Utils.getMath("10^{6}\\;\\aleph") + ")";
        permAleph.getInfo = (_) => "Requires 1e6 ℵ. Unlocks a secret achievement. (please ignore the really big cost, it will become 0 once you reach 1e6 ℵ)";
        permAleph.bought = (_) => {
            if (aleph >= alephCost) {
                aleph -= alephCost;
                theory.invalidateQuaternaryValues();
            }
        };
    }

    theory.setMilestoneCost(new LinearCost(0.02, 0.15));

    {
        expTier = theory.createMilestoneUpgrade(0, 3);
        expTier.getDescription = (_) => {
            if (expTier.level == 0) return "Unlock " + Utils.getMath("q_1") + " exponent on " + Utils.getMath("c_1");
            if (expTier.level == 1) return "Unlock " + Utils.getMath("q_2") + " exponent on " + Utils.getMath("c_2");
            return "Unlock " + Utils.getMath("q_3") + " exponent on " + Utils.getMath("c_3");
        };
        expTier.getInfo = (_) => "Unlocks the next variable exponent in the formula";
        expTier.boughtOrRefunded = (_) => {
            theory.invalidateSecondaryEquation();
            updateAvailability();
        };
    }

    {
        c1Exp = theory.createMilestoneUpgrade(1, 3);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.1");
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.1");
        c1Exp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        c2Exp = theory.createMilestoneUpgrade(2, 3);
        c2Exp.description = Localization.getUpgradeIncCustomExpDesc("c_2", "0.1");
        c2Exp.info = Localization.getUpgradeIncCustomExpInfo("c_2", "0.1");
        c2Exp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        c3Exp = theory.createMilestoneUpgrade(3, 3);
        c3Exp.description = Localization.getUpgradeIncCustomExpDesc("c_3", "0.1");
        c3Exp.info = Localization.getUpgradeIncCustomExpInfo("c_3", "0.1");
        c3Exp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        xExp = theory.createMilestoneUpgrade(4, 3);
        xExp.description = Localization.getUpgradeIncCustomExpDesc("x", "0.05");
        xExp.info = Localization.getUpgradeIncCustomExpInfo("x", "0.05");
        xExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        yExp = theory.createMilestoneUpgrade(5, 3);
        yExp.description = Localization.getUpgradeIncCustomExpDesc("y", "0.05");
        yExp.info = Localization.getUpgradeIncCustomExpInfo("y", "0.05");
        yExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        zExp = theory.createMilestoneUpgrade(6, 3);
        zExp.description = Localization.getUpgradeIncCustomExpDesc("z", "0.1");
        zExp.info = Localization.getUpgradeIncCustomExpInfo("z", "0.1");
        zExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        wBoost = theory.createMilestoneUpgrade(7, 1);
        wBoost.getDescription = (_) => "Upgrade " + Utils.getMath("w") + " base from " + Utils.getMath("2") + " to " + Utils.getMath("3");
        wBoost.getInfo = (_) => "Changes " + Utils.getMath("w") + " formula from " + Utils.getMath("2^{\\text{level}}") + " to " + Utils.getMath("3^{\\text{level}}");
        wBoost.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        deltaAlphaExp = theory.createMilestoneUpgrade(8, 1);
        deltaAlphaExp.getDescription = (_) => "Increase " + Utils.getMath("\\alpha\\;\\text{exponent}") + " in " + Utils.getMath("\\dot{\\Delta}") + " to " + Utils.getMath("0.25");
        deltaAlphaExp.getInfo = (_) => "Raises " + Utils.getMath("\\alpha") + " exponent in " + Utils.getMath("\\Delta") + " production from " + Utils.getMath("0.2") + " to " + Utils.getMath("0.25");
        deltaAlphaExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        deltaInfExp = theory.createMilestoneUpgrade(9, 2);
        deltaInfExp.getDescription = (_) => "Increase " + Utils.getMath("(1+\\infty)") + " exponent in " + Utils.getMath("\\dot{\\Delta}") + " by " + Utils.getMath("0.05");
        deltaInfExp.getInfo = (_) => "Adds +0.05 to the infinity boost exponent per level";
        deltaInfExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        infTauBoost = theory.createMilestoneUpgrade(10, 2);
        infTauBoost.getDescription = (_) => "Multiply " + Utils.getMath("\\dot{\\infty}") + " by " + Utils.getMath("10\\times");
        infTauBoost.getInfo = (_) => "Multiplies infinity gain per second by 10x per level";
        infTauBoost.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        alephMult = theory.createMilestoneUpgrade(11, 2);
        alephMult.getDescription = (_) => "Multiply " + Utils.getMath("\\dot{\\aleph}") + " by " + Utils.getMath("5\\times");
        alephMult.getInfo = (_) => "Multiplies Aleph gain per second by 5x per level";
        alephMult.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        alephDeltaExp = theory.createMilestoneUpgrade(12, 1);
        alephDeltaExp.getDescription = (_) => "Increase " + Utils.getMath("(1+\\Delta)") + " exponent in " + Utils.getMath("\\dot{\\aleph}") + " to " + Utils.getMath("0.2");
        alephDeltaExp.getInfo = (_) => "Raises Δ exponent in Aleph production from 0.1 to 0.2";
        alephDeltaExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        qCapBoost = theory.createMilestoneUpgrade(13, 1);
        qCapBoost.getDescription = (_) => "Increase " + Utils.getMath("q_1, q_2, q_3") + " max level to " + Utils.getMath("75");
        qCapBoost.getInfo = (_) => "Raises the level cap of q1, q2, and q3 from 50 to 75";
        qCapBoost.boughtOrRefunded = (_) => {
            let cap = qCapBoost.level > 0 ? 75 : 50;
            q1.maxLevel = cap;
            q2.maxLevel = cap;
            q3.maxLevel = cap;
        };
    }

    {
        tauExpBoost = theory.createMilestoneUpgrade(14, 1);
        tauExpBoost.getDescription = (_) => "Improve " + Utils.getMath("\\tau\\;\\text{exponent}") + " from " + Utils.getMath("0.001") + " to " + Utils.getMath("0.0012");
        tauExpBoost.getInfo = (_) => "Increases " + Utils.getMath("\\tau = \\max \\alpha^{0.001}") + " to " + Utils.getMath("\\max \\alpha^{0.0012}");
        tauExpBoost.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    catAlpha = theory.createAchievementCategory(0, "Alpha");
    catDelta = theory.createAchievementCategory(1, "Delta");
    catInfinity = theory.createAchievementCategory(2, "Infinity");
    catAleph = theory.createAchievementCategory(3, "Aleph");
    catTau = theory.createAchievementCategory(4, "Tau");
    catSecrets = theory.createAchievementCategory(5, "Secrets");

    achievement1 = theory.createAchievement(0, catAlpha, "And so, it begins. (1)", "Reach 1 α.", () => alpha.value >= 1);
    achievement2 = theory.createAchievement(1, catAlpha, "Limits: First Edition (2.1e9)", "Reach 2,147,483,648 α.", () => alpha.value >= BigNumber.TWO.pow(31));
    achievement3 = theory.createAchievement(2, catAlpha, "Limits: Second Edition (1.79e308)", "Reach 1.7976e308 α.", () => alpha.value >= BigNumber.TWO.pow(1024));
    achievement4 = theory.createAchievement(3, catAlpha, "You Can Only Go So Far (ee8.811)", "Reach ee8.811 α.", () => alpha.value >= BigNumber.TWO.pow(BigNumber.TWO.pow(31)));

    theory.createAchievement(4, catDelta, "Ooo, triangles! (10)", "Reach 10 Δ.", () => delta.value >= 10);
    theory.createAchievement(5, catDelta, "Adding the 'e' (1e10)", "Reach 1e10 Δ.", () => delta.value >= 1e10);
    theory.createAchievement(6, catDelta, "Limits: Thi- no. (1.79e308)", "Reach 1.7976e308 Δ.", () => delta.value >= BigNumber.TWO.pow(1024));
    theory.createAchievement(7, catDelta, "And you will see me again. (2e1024)", "Reach 2e1024 Δ.", () => delta.value >= BigNumber.TWO * BigNumber.TEN.pow(1024));

    theory.createAchievement(8, catInfinity, "It's flipped! (1)", "Reach 1 ∞.", () => infinity.value >= 1);
    theory.createAchievement(9, catInfinity, "...or is it? (1e3)", "Reach 1e3 ∞.", () => infinity.value >= 1e3);
    theory.createAchievement(10, catInfinity, "A lot of Infinity (1e10)", "Reach 1e10 ∞.", () => infinity.value >= 1e10);
    theory.createAchievement(11, catInfinity, "Too much to count (1e100)", "Reach 1e100 ∞.", () => infinity.value >= 1e100);

    theory.createAchievement(12, catAleph, "What's this weird symbol? (1)", "Reach 1 ℵ.", () => aleph >= 1);
    theory.createAchievement(13, catAleph, "It's countable! (100)", "Reach 100 ℵ.", () => aleph >= 1e2);
    theory.createAchievement(14, catAleph, "One Percent (1e4)", "Reach 1e4 ℵ.", () => aleph >= 1e4);
    theory.createAchievement(15, catAleph, "Patience (1e8)", "Reach 1e8 ℵ.", () => aleph >= 1e8);

    achievement5 = theory.createAchievement(16, catTau, "Slow Increases (1.05)", "Reach 1.05 τ.", () => getTau() >= 1.05);
    achievement6 = theory.createAchievement(17, catTau, "Quarter Way There (1.25)", "Reach 1.25 τ.", () => getTau() >= 1.25);
    achievement7 = theory.createAchievement(18, catTau, "Do you want a Tau too? (2)", "Reach 2 τ.", () => getTau() >= 2);
    achievement8 = theory.createAchievement(19, catTau, "Tau or Tav (10)", "Reach 10 τ.", () => getTau() >= 10);
    achievement9 = theory.createAchievement(20, catTau, "That's a tau! (1,000)", "Reach 1,000 τ.", () => getTau() >= 1000);
    theory.createAchievement(21, catTau, "What now? (1e10)", "Reach 1e10 τ.", () => getTau() >= BigNumber.TEN.pow(10));

    secretAchievement1 = theory.createSecretAchievement(22, catSecrets, "A Bit Excessive", "Unlock all 3 variable exponents (q1, q2, and q3).", "Get the formula completed.", () => expTier.level >= 3);
    secretAchievement2 = theory.createSecretAchievement(23, catSecrets, "Useless Upgrades", "Buy 5 levels of x while keeping c2 at level 0.", "Who needs c2 anyway?", () => x.level >= 5 && c2.level == 0);
    secretAchievement3 = theory.createSecretAchievement(24, catSecrets, "Perfectly Balanced", "Have c1, c2, and c3 all at the same level (at least 5).", "Balance your c's.", () => c1.level >= 5 && c1.level == c2.level && c2.level == c3.level);
    secretAchievement4 = theory.createSecretAchievement(25, catSecrets, "Keeping Things Simple", "Reach 1e10 α while keeping c1 at level 1.", "Who needs more than 1 of c1 anyway?", () => alpha.value >= 1e10 && c1.level == 1);
    theory.createSecretAchievement(26, catSecrets, "Beyond", "Purchase the Alephing permanent upgrade.", "Spend what isn't even on the top bar.", () => permAleph.level > 0);

    chapter1 = theory.createStoryChapter(0, "Chapter 1: Alpha",
        "In your attic, you find a notepad that has one thing written:\n\n" +
        "α' = xyz * c1c2c3(1+Δ)^0.15.\n\n" +
        "You take one c1 and put it in the box.\n" +
        "One α comes out.",
        () => c1.level > 0);

    chapter2 = theory.createStoryChapter(1, "Chapter 2: Delta",
        "Your alpha is not enough just yet. You find a weird triangle.\n\n" +
        "With x, y, z, and w,\n" +
        "every number multiplies your tau.",
        () => x.level >= 1 || y.level >= 1 || z.level >= 1 || w.level >= 1);

    chapter3 = theory.createStoryChapter(2, "Chapter 3: Infinity",
        "The third counter on the box refuses to stay still: ∞.\n\n" +
        "Unlike α and Δ, it doesn't just measure size - it measures speed.\n" +
        "Every second, your rate of progress crystallizes into something spendable.",
        () => infinity.value >= 1);

    chapter4 = theory.createStoryChapter(3, "Chapter 4: Publication",
        "The box begins to overheat, spinning very quickly.\n\n" +
        "You tear out the first page of calculations and publish your notes,\n" +
        "resetting the numbers to start again with a permanent multiplier.",
        () => theory.publicationCount >= 1);

    chapter5 = theory.createStoryChapter(4, "Chapter 5: Superscripts",
        "Flipping the notepad over reveals pencil marks above c1, c2, and c3.\n\n" +
        "By spending ∞ on q1, q2, and q3, the variables stop multiplying and start exponentiating.\n" +
        "The numbers jump off the page.",
        () => expTier.level >= 1);

    chapter6 = theory.createStoryChapter(5, "Chapter 6: Time",
        "Buying w bends the edges of the attic box inward.\n\n" +
        "A shadow falls at a right angle to every wall you can see.\n" +
        "Your ∞ gain per second begins to double with every step into 4D space. Or, better said, time.",
        () => w.level >= 5);

    chapter7 = theory.createStoryChapter(6, "Chapter 7: Synergy",
        "The weird triangle and the sideways eight lock together with a sharp click.\n\n" +
        "Raising their link to 0.25 creates a feedback loop between Δ and ∞.\n" +
        "The attic air becomes stronger with pure mathematical resonance.",
        () => permSynergy.level >= 1);

    chapter8 = theory.createStoryChapter(7, "Chapter 8: Overflow",
        "The counters on the box run out of digits and switch to stacked exponents: ee.\n\n" +
        "Even 2^1024 is now a rounding error.\n" +
        "You are no longer counting variables, you are counting orders of infinity.",
        () => alpha.value >= BigNumber.TWO.pow(1024));

    chapter9 = theory.createStoryChapter(8, "Chapter 9: Wall",
        "τ crosses 100, the boundary where ordinary theories softcap.\n\n" +
        "Yet the box keeps going, waiting for the final incrase.\n" +
        "Only Limitless can carry the equation any further.",
        () => getTau() >= BigNumber.TEN.pow(2));

    chapter10 = theory.createStoryChapter(9, "Chapter 10: Cookie's Theory",
        "At 1e15 τ, the notepad's final blank page fills itself in with glowing ink:\n\n" +
        "Q.E.D.\n\n" +
        "The attic, the box, and the universe are now one equation.\n" +
        "Cookie's Theory is proven.",
        () => getTau() >= BigNumber.TEN.pow(15));

    updateAvailability();
}

var updateAvailability = () => {
    q1.isAvailable = expTier.level >= 1;
    q2.isAvailable = expTier.level >= 2;
    q3.isAvailable = expTier.level >= 3;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;

    let qBonus = BigNumber.from(0.05 * permQBoost.level);
    let q1Exp = (expTier.level >= 1 ? getQ1(q1.level) : BigNumber.ONE) + BigNumber.from(0.1 * c1Exp.level) + qBonus;
    let q2Exp = (expTier.level >= 2 ? getQ2(q2.level) : BigNumber.ONE) + BigNumber.from(0.1 * c2Exp.level) + qBonus;
    let q3Exp = (expTier.level >= 3 ? getQ3(q3.level) : BigNumber.ONE) + BigNumber.from(0.1 * c3Exp.level) + qBonus;

    let vC1 = getC1(c1.level).pow(q1Exp);
    let vC2 = getC2(c2.level).pow(permC2Boost.level > 0 ? 1.25 : 1).pow(q2Exp);
    let vC3 = getC3(c3.level).pow(permC3Boost.level > 0 ? 1.25 : 1).pow(q3Exp);

    let vW = getW(w.level);
    let vX = getX(x.level).pow(1 + 0.05 * xExp.level);
    let vY = getY(y.level).pow(1 + 0.05 * yExp.level);
    let vZ = getZ(z.level).pow(1 + 0.1 * zExp.level);

    let vPerm = BigNumber.TEN.pow(permMult.level + 3 * permOverdrive.level);

    let synergyExp = permSynergy.level > 0 ? 0.25 : 0.15;
    let deltaBoost = (BigNumber.ONE + delta.value).pow(synergyExp);
    let infBoost = (BigNumber.ONE + infinity.value).pow(synergyExp + 0.05 * deltaInfExp.level);

    let dAlpha = bonus * vPerm * (permAleph.level > 0 ? 100 : 1) * vX * vY * vZ * vC1 * vC2 * vC3 * deltaBoost;
    rateAlpha = dAlpha;
    alpha.value += dt * dAlpha;

    let currentTau = getTau();
    if (currentTau > BigNumber.ONE) {
        let dInf = BigNumber.TEN.pow(infTauBoost.level) * BigNumber.TWO.pow(permInfBoost.level) * (vW * currentTau.log10()) / BigNumber.from(3600);
        rateInf = dInf;
        infinity.value += dt * dInf;
    } else {
        rateInf = BigNumber.ZERO;
    }

    if (alpha.value >= 10) {
        let dDelta = BigNumber.from(5).pow(permDeltaBoost.level) * alpha.value.pow(deltaAlphaExp.level > 0 ? 0.25 : 0.2) * infBoost;
        rateDelta = dDelta;
        delta.value += dt * dDelta;
    } else {
        rateDelta = BigNumber.ZERO;
    }

    let dAleph = BigNumber.from(5).pow(alephMult.level) * (BigNumber.ONE + infinity.value).log() * (BigNumber.ONE + delta.value).pow(alephDeltaExp.level > 0 ? 0.2 : 0.1);
    rateAleph = dAleph;
    aleph += dt * dAleph;

    theory.invalidateQuaternaryValues();
}

var getPrimaryEquation = () => theory.latexSymbol + " = \\max \\alpha^{" + (tauExpBoost.level > 0 ? "0.0012" : "0.001") + "}";

var getSecondaryEquation = () => {
    let term1 = "c_1";
    if (expTier.level >= 1 && c1Exp.level > 0) {
        term1 = "c_1^{q_1 + " + (0.1 * c1Exp.level).toFixed(1) + "}";
    } else if (expTier.level >= 1) {
        term1 = "c_1^{q_1}";
    } else if (c1Exp.level > 0) {
        term1 = "c_1^{" + (1 + 0.1 * c1Exp.level).toFixed(1) + "}";
    }

    let term2 = "c_2";
    if (expTier.level >= 2 && c2Exp.level > 0) {
        term2 = "c_2^{q_2 + " + (0.1 * c2Exp.level).toFixed(1) + "}";
    } else if (expTier.level >= 2) {
        term2 = "c_2^{q_2}";
    } else if (c2Exp.level > 0) {
        term2 = "c_2^{" + (1 + 0.1 * c2Exp.level).toFixed(1) + "}";
    }

    let term3 = "c_3";
    if (expTier.level >= 3 && c3Exp.level > 0) {
        term3 = "c_3^{q_3 + " + (0.1 * c3Exp.level).toFixed(1) + "}";
    } else if (expTier.level >= 3) {
        term3 = "c_3^{q_3}";
    } else if (c3Exp.level > 0) {
        term3 = "c_3^{" + (1 + 0.1 * c3Exp.level).toFixed(1) + "}";
    }

    let termX = xExp.level > 0 ? "x^{" + (1 + 0.05 * xExp.level).toFixed(2) + "}" : "x";
    let termY = yExp.level > 0 ? "y^{" + (1 + 0.05 * yExp.level).toFixed(2) + "}" : "y";
    let termZ = zExp.level > 0 ? "z^{" + (1 + 0.1 * zExp.level).toFixed(1) + "}" : "z";

    let synergyExp = permSynergy.level > 0 ? 0.25 : 0.15;
    let dAlphaExp = deltaAlphaExp.level > 0 ? "0.25" : "0.2";
    let dInfExp = (synergyExp + 0.05 * deltaInfExp.level).toFixed(2);
    let infPrefix = infTauBoost.level > 0 ? "10^{" + infTauBoost.level + "}" : "";
    let alephPrefix = alephMult.level > 0 ? "5^{" + alephMult.level + "}" : "";
    let alephDExp = alephDeltaExp.level > 0 ? "0.2" : "0.1";

    let row1 = "\\dot{\\alpha} = " + termX + " " + termY + " " + termZ + " \\cdot " + term1 + " " + term2 + " " + term3 + " (1+\\Delta)^{" + synergyExp + "}";
    let row2 = "\\dot{\\Delta} = \\alpha^{" + dAlphaExp + "}(1+\\infty)^{" + dInfExp + "}";
    let row3 = "\\dot{\\infty} = " + infPrefix + "w \\cdot \\log_{10}(\\tau)/\\text{h}";
    let row4 = "\\dot{\\aleph} = " + alephPrefix + "\\ln(1+\\infty)(1+\\Delta)^{" + alephDExp + "}";

    return "\\begin{matrix}" + row1 + " \\\\ " + row2 + " \\\\ " + row3 + " \\\\ " + row4 + "\\end{matrix}";
};

var getPublicationMultiplier = (tau) => tau.pow(40 + 5 * permPubBoost.level);
var getPublicationMultiplierFormula = (symbol) => "{" + symbol + "}^{" + (40 + 5 * permPubBoost.level) + "}";
var getTau = () => alpha.value.pow(tauExpBoost.level > 0 ? 0.0012 : 0.001);
var get2DGraphValue = () => {
    let val = alpha.value.abs();
    if (val <= BigNumber.TEN) return alpha.value.sign * (BigNumber.ONE + val).log10().toNumber();
    return alpha.value.sign * (1 + val.log10().log10().toNumber());
};

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC2 = (level) => Utils.getStepwisePowerSum(level, 3, 10, 1);
var getC3 = (level) => BigNumber.from(1.5).pow(level);
var getW = (level) => BigNumber.from(wBoost.level > 0 ? 3 : 2).pow(level);
var getX = (level) => BigNumber.from(100).pow(level);
var getY = (level) => BigNumber.from(10).pow(level);
var getZ = (level) => Utils.getStepwisePowerSum(level, 5, 10, 1);
var getQ1 = (level) => BigNumber.from(1 + 0.01 * level);
var getQ2 = (level) => BigNumber.from(1 + 0.01 * level);
var getQ3 = (level) => BigNumber.from(1 + 0.01 * level);

var getQuaternaryEntries = () => [
    new QuaternaryEntry("\\alpha", alpha.value.toString(3)),
    new QuaternaryEntry("\\dot{\\alpha}", alpha.value >= BigNumber.TEN.pow(100) ? rateAlpha.toString(6) : null),
    new QuaternaryEntry("\\Delta", delta.value > BigNumber.ZERO ? delta.value.toString(3) : null),
    new QuaternaryEntry("\\dot{\\Delta}", delta.value >= BigNumber.from(1e10) ? rateDelta.toString(6) : null),
    new QuaternaryEntry("\\infty", infinity.value > BigNumber.ZERO ? infinity.value.toString(3) : null),
    new QuaternaryEntry("\\dot{\\infty}", infinity.value > BigNumber.from(0.01) ? rateInf.toString(6) : null),
    new QuaternaryEntry("\\aleph", aleph > BigNumber.ONE ? aleph.toString(3) : null),
    new QuaternaryEntry("\\dot{\\aleph}", aleph > BigNumber.ONE ? rateAleph.toString(6) : null)
];

var postPublish = () => {
    aleph = BigNumber.ZERO;
    theory.invalidateQuaternaryValues();
};

var getInternalState = () => JSON.stringify({
    aleph: aleph.toBase64String()
});

var setInternalState = (stateStr) => {
    if (!stateStr) return;
    let state = JSON.parse(stateStr);
    if (state.aleph) aleph = BigNumber.fromBase64String(state.aleph);
};


init();
