import { BusinessRule } from './BusinessRule';

export abstract class BusinessRuleCheckResult {
  abstract toString(): string;
  abstract isComplianed(): boolean;
}

export class RuleBreak extends BusinessRuleCheckResult {
  private rule: BusinessRule;

  constructor(rule: BusinessRule) {
    super();
    this.rule = rule;
  }

  toString(): string {
    return "NOK";
  }

  isComplianed(): boolean {
    return false;
  }

  affectedRule(): BusinessRule {
    return this.rule;
  }
}

export class CrossCheckRequired extends BusinessRuleCheckResult {
  private rules: Array<BusinessRule>;

  constructor(rules: Array<BusinessRule>) {
    super();
    this.rules = rules;
  }

  toString(): string {
    return "CHK";
  }

  isComplianed(): boolean {
    return false;
  }

  affectedRules(): Array<BusinessRule> {
    return this.rules;
  }
}

export class Compliance extends BusinessRuleCheckResult {
  toString(): string {
    return "OK";
  }

  isComplianed(): boolean {
    return true;
  }
}
