import { ConstantCost, CustomCost, ExponentialCost, FirstFreeCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { QuaternaryEntry, theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "quantum_antimatter_collider";
var name = "Quantum Collider";
var description = "Accelerate Matter (M+) and Antimatter (A-) beams, then collide them at peak balance to annihilate pairs into Energy (E).";
var authors = "thecoolcookie366";
var version = 2;

var matter, antimatter, energy;

var collisionCount = 0;
var resonanceCount = 0;
var animStep = 0;
var boomFrames = 0;
var animTimer = 0;

var m1, m2, m3;
var a1, a2, a3;
var efficiency, collideBtn;

var permEnergyMult, permMatterMult, permAntimatterMult, permResonanceBoost, permKeepRatio, permPubBoost, permSiphonBoost, permBgToggle;

var matterExp, antimatterExp, effExp, resonanceThreshold, passiveSiphon, tauExpBoost, cascadeLink;

var catMatter, catAntimatter, catCollisions, catEnergy, catTau, catSecrets;
var chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10;

var getBalanceRatio = () => {
    let m = matter.value;
    let a = antimatter.value;
    if (m <= BigNumber.ZERO || a <= BigNumber.ZERO) return BigNumber.ZERO;
    let minVal = m.min(a);
    let maxVal = m.max(a);
    return minVal / maxVal;
};

var getResonanceThreshold = () => {
    return BigNumber.from(0.90 - 0.10 * resonanceThreshold.level);
};

var getResonanceMultiplier = () => {
    let ratio = getBalanceRatio();
    if (ratio >= getResonanceThreshold()) {
        return BigNumber.from(5) * BigNumber.TWO.pow(permResonanceBoost.level);
    }
    return BigNumber.ONE;
};

var getProjectedEnergy = () => {
    let minVal = matter.value.min(antimatter.value);
    if (minVal <= BigNumber.ZERO) return BigNumber.ZERO;
    let eff = getEfficiency(efficiency.level).pow(1 + 0.1 * effExp.level);
    let permMult = BigNumber.TEN.pow(permEnergyMult.level);
    return minVal * eff * permMult * getResonanceMultiplier();
};

var init = () => {
    matter = theory.createCurrency("M+", "M_+");
    antimatter = theory.createCurrency("A-", "A_-");
    energy = theory.createCurrency("E", "E");

    {
        let getDesc = (level) => "m_1=" + getM1(level).toString(0);
        m1 = theory.createUpgrade(0, matter, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))));
        m1.getDescription = (_) => Utils.getMath(getDesc(m1.level));
        m1.getInfo = (amount) => Utils.getMathTo(getDesc(m1.level), getDesc(m1.level + amount));
    }

    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(1, antimatter, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    }

    {
        let getDesc = (level) => "m_2=" + getM2(level).toString(0);
        m2 = theory.createUpgrade(2, matter, new ExponentialCost(150, Math.log2(3.5)));
        m2.getDescription = (_) => Utils.getMath(getDesc(m2.level));
        m2.getInfo = (amount) => Utils.getMathTo(getDesc(m2.level), getDesc(m2.level + amount));
    }

    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(3, antimatter, new ExponentialCost(150, Math.log2(3.5)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
    }

    {
        let getDesc = (level) => "m_3=2^{" + level + "}";
        let getInfo = (level) => "m_3=" + getM3(level).toString(0);
        m3 = theory.createUpgrade(4, matter, new ExponentialCost(1e4, Math.log2(12)));
        m3.getDescription = (_) => Utils.getMath(getDesc(m3.level));
        m3.getInfo = (amount) => Utils.getMathTo(getInfo(m3.level), getInfo(m3.level + amount));
    }

    {
        let getDesc = (level) => "a_3=2^{" + level + "}";
        let getInfo = (level) => "a_3=" + getA3(level).toString(0);
        a3 = theory.createUpgrade(5, antimatter, new ExponentialCost(1e4, Math.log2(12)));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getInfo(a3.level), getInfo(a3.level + amount));
    }

    {
        let getDesc = (level) => "\\eta = " + getEfficiency(level).toString(2);
        efficiency = theory.createUpgrade(6, energy, new ExponentialCost(5, Math.log2(2.5)));
        efficiency.getDescription = (_) => Utils.getMath(getDesc(efficiency.level));
        efficiency.getInfo = (amount) => Utils.getMathTo(getDesc(efficiency.level), getDesc(efficiency.level + amount));
    }

    {
        collideBtn = theory.createUpgrade(7, matter, new FreeCost());
        collideBtn.isAutoBuyable = false;
        collideBtn.getDescription = (_) => "Collide Beams (" + Utils.getMath("M_+ + A_- \\to E") + ")";
        collideBtn.getInfo = (_) => "Annihilates min(M+, A-) from both beams into Energy. Balance beams within resonance threshold for a massive bonus!";
        collideBtn.bought = (_) => {
            let minVal = matter.value.min(antimatter.value);
            if (minVal > BigNumber.ZERO) {
                let isRes = getBalanceRatio() >= getResonanceThreshold();
                let gainedE = getProjectedEnergy();
                let keepFrac = BigNumber.from(0.1 * permKeepRatio.level);
                let consumed = minVal * (BigNumber.ONE - keepFrac);
                matter.value -= consumed;
                antimatter.value -= consumed;
                if (matter.value < BigNumber.ZERO) matter.value = BigNumber.ZERO;
                if (antimatter.value < BigNumber.ZERO) antimatter.value = BigNumber.ZERO;
                energy.value += gainedE;
                collisionCount += 1;
                if (isRes) resonanceCount += 1;
                boomFrames = 6;
                theory.invalidateSecondaryEquation();
                theory.invalidateQuaternaryValues();
            }
            collideBtn.level = 0;
        };
    }

    theory.createPublicationUpgrade(0, energy, 1e6);
    theory.createBuyAllUpgrade(1, matter, 1e8);
    theory.createAutoBuyerUpgrade(2, antimatter, 1e8);

    {
        permEnergyMult = theory.createPermanentUpgrade(3, energy, new ExponentialCost(1e4, Math.log2(1e3)));
        permEnergyMult.maxLevel = 10;
        permEnergyMult.getDescription = (_) => "Permanent " + Utils.getMath("10^{" + permEnergyMult.level + "}\\times E\\;\\text{yield}");
        permEnergyMult.getInfo = (_) => "Multiplies Energy yield from collisions by 10x per level";
    }

    {
        permMatterMult = theory.createPermanentUpgrade(4, matter, new ExponentialCost(1e10, Math.log2(1e4)));
        permMatterMult.maxLevel = 10;
        permMatterMult.getDescription = (_) => "Permanent " + Utils.getMath("5^{" + permMatterMult.level + "}\\times M_+\\;\\text{gain}");
        permMatterMult.getInfo = (_) => "Multiplies Matter production by 5x per level";
    }

    {
        permAntimatterMult = theory.createPermanentUpgrade(5, antimatter, new ExponentialCost(1e10, Math.log2(1e4)));
        permAntimatterMult.maxLevel = 10;
        permAntimatterMult.getDescription = (_) => "Permanent " + Utils.getMath("5^{" + permAntimatterMult.level + "}\\times A_-\\;\\text{gain}");
        permAntimatterMult.getInfo = (_) => "Multiplies Antimatter production by 5x per level";
    }

    {
        permResonanceBoost = theory.createPermanentUpgrade(6, energy, new ExponentialCost(1e8, Math.log2(1e5)));
        permResonanceBoost.maxLevel = 5;
        permResonanceBoost.getDescription = (_) => "Resonance Multiplier " + Utils.getMath("2^{" + permResonanceBoost.level + "}\\times");
        permResonanceBoost.getInfo = (_) => "Doubles the Resonance collision bonus per level";
    }

    {
        permKeepRatio = theory.createPermanentUpgrade(7, energy, new CustomCost((level) => {
            if (level < 9) {
                return BigNumber.from(1e12) * BigNumber.TEN.pow(6 * level);
            }
            return BigNumber.TEN.pow(250);
        }));
        permKeepRatio.maxLevel = 10;
        permKeepRatio.getDescription = (_) => "Beam Retention (" + (permKeepRatio.level * 0.1).toFixed(1) + "x)";
        permKeepRatio.getInfo = (_) => "Retains 0.1x of annihilated M+ and A- after each collision per level (1.0x = zero loss!)";
    }

    {
        permPubBoost = theory.createPermanentUpgrade(8, energy, new ExponentialCost(1e20, Math.log2(1e10)));
        permPubBoost.maxLevel = 5;
        permPubBoost.getDescription = (_) => "Publication Exp +" + (permPubBoost.level * 0.5).toFixed(1);
        permPubBoost.getInfo = (_) => "Increases Publication multiplier exponent by +0.5 per level";
        permPubBoost.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        permSiphonBoost = theory.createPermanentUpgrade(9, energy, new ExponentialCost(1e15, Math.log2(1e5)));
        permSiphonBoost.maxLevel = 5;
        permSiphonBoost.getDescription = (_) => "Siphon Rate " + Utils.getMath("2^{" + permSiphonBoost.level + "}\\times");
        permSiphonBoost.getInfo = (_) => "Doubles passive Energy siphon rate per level";
    }

    {
        permBgToggle = theory.createPermanentUpgrade(10, energy, new FreeCost());
        permBgToggle.maxLevel = 2;
        permBgToggle.getDescription = (_) => "Collider Animation: " + (permBgToggle.level == 1 ? Utils.getMath("\\text{ON}") : Utils.getMath("\\text{OFF}"));
        permBgToggle.getInfo = (_) => "Toggles the particle collider animation in the center display - OFF (0) and ON (1).";
        permBgToggle.bought = (_) => {
            if (permBgToggle.level >= 2) {
                permBgToggle.level = 0;
            }
            theory.invalidateSecondaryEquation();
        };
    }

    theory.setMilestoneCost(new LinearCost(0.15, 0.35));

    {
        matterExp = theory.createMilestoneUpgrade(0, 3);
        matterExp.description = Localization.getUpgradeIncCustomExpDesc("m_1, m_2", "0.1");
        matterExp.info = Localization.getUpgradeIncCustomExpInfo("m_1, m_2", "0.1");
        matterExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        antimatterExp = theory.createMilestoneUpgrade(1, 3);
        antimatterExp.description = Localization.getUpgradeIncCustomExpDesc("a_1, a_2", "0.1");
        antimatterExp.info = Localization.getUpgradeIncCustomExpInfo("a_1, a_2", "0.1");
        antimatterExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        effExp = theory.createMilestoneUpgrade(2, 3);
        effExp.getDescription = (_) => "Increase " + Utils.getMath("\\eta\\;\\text{exponent}") + " by " + Utils.getMath("0.1");
        effExp.getInfo = (_) => "Increases " + Utils.getMath("\\eta") + " exponent by " + Utils.getMath("0.1") + " per level";
        effExp.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        resonanceThreshold = theory.createMilestoneUpgrade(3, 2);
        resonanceThreshold.getDescription = (_) => "Lower Resonance threshold by " + Utils.getMath("0.1\\;\\text{x}");
        resonanceThreshold.getInfo = (_) => "Triggers Resonance bonus at 0.8x (then 0.7x) beam balance";
        resonanceThreshold.boughtOrRefunded = (_) => theory.invalidateQuaternaryValues();
    }

    {
        passiveSiphon = theory.createMilestoneUpgrade(4, 2);
        passiveSiphon.getDescription = (_) => "Passive Siphon (" + Utils.getMath(((passiveSiphon.level + 1) * 0.1).toFixed(1) + "\\text{x}") + " of " + Utils.getMath("\\Delta E/\\text{s}") + ")";
        passiveSiphon.getInfo = (_) => "Passively generates 0.1x (then 0.2x) of projected collision Energy per second without consuming beams";
    }

    {
        cascadeLink = theory.createMilestoneUpgrade(5, 1);
        cascadeLink.getDescription = (_) => "Energy Feedback (" + Utils.getMath("(1+E)^{0.15}") + " to beams)";
        cascadeLink.getInfo = (_) => "Stored Energy boosts both M+ and A- production";
        cascadeLink.boughtOrRefunded = (_) => theory.invalidateSecondaryEquation();
    }

    {
        tauExpBoost = theory.createMilestoneUpgrade(6, 1);
        tauExpBoost.getDescription = (_) => "Improve " + Utils.getMath("\\tau\\;\\text{exponent}") + " to " + Utils.getMath("0.06");
        tauExpBoost.getInfo = (_) => "Increases " + Utils.getMath("\\tau = \\max E^{0.05}") + " to " + Utils.getMath("\\max E^{0.06}");
        tauExpBoost.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    catMatter = theory.createAchievementCategory(0, "Matter");
    catAntimatter = theory.createAchievementCategory(1, "Antimatter");
    catCollisions = theory.createAchievementCategory(2, "Collisions");
    catEnergy = theory.createAchievementCategory(3, "Energy");
    catTau = theory.createAchievementCategory(4, "Tau");
    catSecrets = theory.createAchievementCategory(5, "Secrets");

    theory.createAchievement(0, catMatter, "A Positive Particle", "Reach 1,000 M+.", () => matter.value >= 1000);
    theory.createAchievement(1, catMatter, "Limited Matter", "Reach 9e15 M+.", () => matter.value >= BigNumber.from(9) * BigNumber.TEN.pow(15));
    theory.createAchievement(2, catMatter, "A Third Of The Way", "Reach 1e100 M+.", () => matter.value >= BigNumber.TEN.pow(100));
    theory.createAchievement(3, catMatter, "Matter Dimensions", "Reach 1.7976e308 M+.", () => matter.value >= BigNumber.TWO.pow(1024));

    theory.createAchievement(4, catAntimatter, "A Negative Particle", "Reach 1,000 A-.", () => antimatter.value >= 1000);
    theory.createAchievement(5, catAntimatter, "Limited Antimatter", "Reach 9e15 A-.", () => antimatter.value >= BigNumber.from(9) * BigNumber.TEN.pow(15));
    theory.createAchievement(6, catAntimatter, "A Negative Third Of The Way", "Reach 1e100 A-.", () => antimatter.value >= BigNumber.TEN.pow(100));
    theory.createAchievement(7, catAntimatter, "Antimatter Dimensions", "Reach 1.7976e308 A-.", () => antimatter.value >= BigNumber.TWO.pow(1024));

    theory.createAchievement(8, catCollisions, "First Steps", "Perform your first beam collision.", () => collisionCount >= 1);
    theory.createAchievement(9, catCollisions, "Getting Used To It", "Perform 25 beam collisions.", () => collisionCount >= 25);
    theory.createAchievement(10, catCollisions, "More Or Less", "Perform 125 beam collisions.", () => collisionCount >= 125);
    theory.createAchievement(11, catCollisions, "You Got This!", "Perform 625 beam collisions.", () => collisionCount >= 625);
    theory.createAchievement(12, catCollisions, "I'm Perfect!", "Trigger 5 Resonance collisions.", () => resonanceCount >= 5);
    theory.createAchievement(13, catCollisions, "It Gets Boring", "Trigger 25 Resonance collisions.", () => resonanceCount >= 25);

    theory.createAchievement(14, catEnergy, "Small Energy", "Reach 1,000 Energy.", () => energy.value >= 1000);
    theory.createAchievement(15, catEnergy, "Medium Energy", "Reach 1e12 Energy.", () => energy.value >= BigNumber.TEN.pow(12));
    theory.createAchievement(16, catEnergy, "Large Energy", "Reach 1e40 Energy.", () => energy.value >= BigNumber.TEN.pow(40));
    theory.createAchievement(17, catEnergy, "Big Bang", "Reach 1e100 Energy.", () => energy.value >= BigNumber.TEN.pow(100));
    theory.createAchievement(18, catEnergy, "Infinite Energy", "Reach 1e300 Energy.", () => energy.value >= BigNumber.TEN.pow(300));
    
    theory.createAchievement(19, catTau, "First Tau", "Reach 1.1 τ.", () => getTau() >= 1.1);
    theory.createAchievement(20, catTau, "Double Tau", "Reach 2 τ.", () => getTau() >= 2);
    theory.createAchievement(21, catTau, "Many, many Tau", "Reach 1,000 τ.", () => getTau() >= 1000);
    theory.createAchievement(22, catTau, "It's Enough Tau!", "Reach 1e10 τ.", () => getTau() >= BigNumber.TEN.pow(10));
    theory.createAchievement(23, catTau, "Once Upon A Tau...", "Reach 1e30 τ.", () => getTau() >= BigNumber.TEN.pow(30));

    theory.createSecretAchievement(24, catSecrets, "Practically Perfect", "Collide beams when Balance is 99% or higher.", "True perfection.", () => collisionCount >= 1 && getBalanceRatio() >= BigNumber.from(0.99));
    theory.createSecretAchievement(25, catSecrets, "Theoretically Perfect", "Collide beams when Balance is 100%.", "Truer perfection.", () => collisionCount >= 1 && getBalanceRatio() >= BigNumber.from(1));
    theory.createSecretAchievement(26, catSecrets, "Only Matter", "Have 1e10 M+ while A- is 0.", "All matter, no antimatter.", () => matter.value >= BigNumber.TEN.pow(10) && antimatter.value == BigNumber.ZERO);
    theory.createSecretAchievement(27, catSecrets, "Only Antimatter", "Have 1e10 A- while M+ is 0.", "All antimatter, no matter.", () => antimatter.value >= BigNumber.TEN.pow(10) && matter.value == BigNumber.ZERO);
    theory.createSecretAchievement(28, catSecrets, "I Can Hear Particles", "Turn on the Collider visualizer.", "Watch the particles fly.", () => permBgToggle.level == 1);
    theory.createSecretAchievement(29, catSecrets, "All The Same", "Trigger 125 Resonance collisions.", "Perfection is everything.", () => resonanceCount >= 125);

    chapter1 = theory.createStoryChapter(0, "Chapter 1: Beams",
        "Inside the underground ring, two opposing particle beams accelerate in opposite directions.\n\n" +
        "Positive Matter (M+) builds in the upper ring.\n" +
        "Negative Antimatter (A-) builds in the lower ring.",
        () => m1.level > 0 || a1.level > 0);

    chapter2 = theory.createStoryChapter(1, "Chapter 2: Annihilation",
        "On their own, M+ and A- generate zero τ.\n\n" +
        "Tap Collide Beams to smash them together, annihilating min(M+, A-) into pure Energy (E).",
        () => collisionCount >= 1);

    chapter3 = theory.createStoryChapter(2, "Chapter 3: Resonance",
        "When the positive and negative beams are balanced within 90% of each other, the collision achieves Perfect Resonance.\n\n" +
        "The annihilation yield multiplies by 5x.",
        () => resonanceCount >= 1);

    chapter4 = theory.createStoryChapter(3, "Chapter 4: Synching",
        "Tier III synchs come online, doubling beam intensity with every magnetic pulse.\n\n" +
        "The containment field enlarges as particles approach light speed.",
        () => m3.level > 0 || a3.level > 0);

    chapter5 = theory.createStoryChapter(4, "Chapter 5: Siphon",
        "With the Passive Siphon milestone unlocked, stray particles graze one another every second.\n\n" +
        "Energy flows continuously even between manual collisions.",
        () => passiveSiphon.level >= 1);

    chapter6 = theory.createStoryChapter(5, "Chapter 6: Publication",
        "The collider core reaches critical thermal load.\n\n" +
        "You publish your collision logs, resetting the ring with a permanent multiplier.",
        () => theory.publicationMultiplier > BigNumber.TWO);

    chapter7 = theory.createStoryChapter(6, "Chapter 7: Feedback",
        "Stored Energy now feeds directly back into the coils.\n\n" +
        "Every collision accelerates the next wave of Matter and Antimatter.",
        () => cascadeLink.level >= 1);

    chapter8 = theory.createStoryChapter(7, "Chapter 8: Singularity",
        "At 1e10 τ, the collision energy density tears open a stable micro-singularity.\n\n" +
        "Matter and antimatter annihilate into pure mathematics.",
        () => getTau() >= BigNumber.TEN.pow(10));

    chapter9 = theory.createStoryChapter(8, "Chapter 9: Containment",
        "At Beam Retention 1.0x, magnetic mirrors reflect 100% of the colliding beams back into the ring.\n\n" +
        "You can now trigger infinite collisions without losing a single particle.",
        () => permKeepRatio.level >= 10);

    chapter10 = theory.createStoryChapter(9, "Chapter 10: Quantum Collider",
        "At 1e50 τ, positive and negative forces merge into a single unified field.\n\n" +
        "The Quantum Collider has reached its ultimate state.\n\n" +
        "Q.E.D.",
        () => getTau() >= BigNumber.TEN.pow(50));
};

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;

    let mExp = 1 + 0.1 * matterExp.level;
    let aExp = 1 + 0.1 * antimatterExp.level;
    let eFeedback = cascadeLink.level > 0 ? (BigNumber.ONE + energy.value).pow(0.15) : BigNumber.ONE;

    let dMatter = bonus * BigNumber.from(5).pow(permMatterMult.level) * eFeedback * getM1(m1.level).pow(mExp) * getM2(m2.level).pow(mExp) * getM3(m3.level);
    let dAntimatter = bonus * BigNumber.from(5).pow(permAntimatterMult.level) * eFeedback * getA1(a1.level).pow(aExp) * getA2(a2.level).pow(aExp) * getA3(a3.level);

    matter.value += dt * dMatter;
    antimatter.value += dt * dAntimatter;

    if (passiveSiphon.level > 0) {
        let siphonFrac = BigNumber.from(0.1 * passiveSiphon.level) * BigNumber.TWO.pow(permSiphonBoost.level);
        energy.value += dt * getProjectedEnergy() * siphonFrac;
    }

    if (permBgToggle.level == 1) {
        if (boomFrames > 0) {
            boomFrames -= 1;
        }
        theory.invalidateSecondaryEquation();
    }

    theory.invalidateQuaternaryValues();
};

var getColliderTrack = () => {
    if (boomFrames > 0) {
        return "\\text{[===== * BOOM * =====]}";
    }
    let ratio = getBalanceRatio().toNumber(); 
    let pos = Math.min(6, Math.max(0, Math.floor(ratio * 6.99)));
    if (getBalanceRatio() >= getResonanceThreshold()) {
        pos = 6; 
    }
    let left = "=".repeat(pos) + "+";
    let mid = "=".repeat(12 - pos * 2);
    let right = "-" + "=".repeat(pos);
    return "\\text{[" + left + mid + right + "]}";
};

var getPrimaryEquation = () => theory.latexSymbol + " = \\min(10^{50}, \\max E^{" + (tauExpBoost.level > 0 ? "0.06" : "0.05") + "})";

var getSecondaryEquation = () => {
    let mStr = matterExp.level > 0 ? "(m_1 m_2)^{" + (1 + 0.1 * matterExp.level).toFixed(1) + "}" : "m_1 m_2";
    let aStr = antimatterExp.level > 0 ? "(a_1 a_2)^{" + (1 + 0.1 * antimatterExp.level).toFixed(1) + "}" : "a_1 a_2";
    let fbStr = cascadeLink.level > 0 ? "(1+E)^{0.15}" : "";
    let etaStr = effExp.level > 0 ? "\\eta^{" + (1 + 0.1 * effExp.level).toFixed(1) + "}" : "\\eta";

    let row1 = "\\dot{M}_+ = " + mStr + " m_3 " + fbStr + ", \\quad \\dot{A}_- = " + aStr + " a_3 " + fbStr;
    let row2 = "\\Delta E = \\min(M_+, A_-) \\cdot " + etaStr + " \\cdot R_{\\text{res}}";

    if (permBgToggle.level == 1) {
        return "\\begin{matrix}" + row1 + " \\\\ " + row2 + " \\\\ " + getColliderTrack() + "\\end{matrix}";
    }
    return "\\begin{matrix}" + row1 + " \\\\ " + row2 + "\\end{matrix}";
};

var getQuaternaryEntries = () => {
    let ratioPct = (getBalanceRatio().toNumber() * 100).toFixed(1) + "\uFF05";
    let isRes = getBalanceRatio() >= getResonanceThreshold();
    return [
        new QuaternaryEntry("+M", "+" + matter.value.toString(2)),
        new QuaternaryEntry("-A", "-" + antimatter.value.toString(2)),
        new QuaternaryEntry("\\text{Bal}", isRes ? ratioPct + " (RES!)" : ratioPct),
        new QuaternaryEntry("\\Delta E", getProjectedEnergy().toString(2))
    ];
};

var getPublicationMultiplier = (tau) => tau.pow(2.5 + 0.5 * permPubBoost.level);
var getPublicationMultiplierFormula = (symbol) => "{" + symbol + "}^{" + (2.5 + 0.5 * permPubBoost.level).toFixed(1) + "}";
var getTau = () => energy.value.pow(tauExpBoost.level > 0 ? 0.06 : 0.05).min(BigNumber.TEN.pow(50));
var get2DGraphValue = () => (BigNumber.ONE + matter.value).log10().toNumber() - (BigNumber.ONE + antimatter.value).log10().toNumber();

var getM1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getM2 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getA2 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getM3 = (level) => BigNumber.TWO.pow(level);
var getA3 = (level) => BigNumber.TWO.pow(level);
var getEfficiency = (level) => BigNumber.ONE + BigNumber.from(0.25 * level);

var postPublish = () => {
    theory.invalidateQuaternaryValues();
};

var getInternalState = () => JSON.stringify({
    collisionCount: collisionCount,
    resonanceCount: resonanceCount
});

var setInternalState = (stateStr) => {
    if (!stateStr) return;
    let state = JSON.parse(stateStr);
    if (state.collisionCount !== undefined) collisionCount = state.collisionCount;
    if (state.resonanceCount !== undefined) resonanceCount = state.resonanceCount;
};

init();
