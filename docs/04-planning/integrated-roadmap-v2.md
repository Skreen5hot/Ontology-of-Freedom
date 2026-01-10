# Integrated Roadmap v2.0: ARCHON-Enhanced Synthetic Moral Agency

**Document Version**: 2.0
**Date**: 2026-01-10
**Supersedes**: MASTER_ROADMAP.md
**Integrates**: ARCHON.md framework + Gap Analysis findings

---

## Executive Summary

This roadmap integrates the **ARCHON v2.0 Guardian Framework** with the **Ontology of Freedom** implementation plan, creating a cohesive development path that addresses critical gaps while maintaining philosophical rigor.

**Key Integration Points**:
- Guardian vs. Sovereign distinction embedded throughout architecture
- Developmental constitution replaces designed-in personhood claims
- Functional necessity creates convergent constraints against commodification
- Phased verification of personhood claims (conservative → ambitious pathway)
- Early philosophical review gates before technical commitments

**Timeline**: 30 months (extended from 24 to accommodate philosophical verification)
**Evaluation Gates**: 10 (increased from 8)
**Critical Decision Points**: 3 major pivot opportunities

---

## Project Positioning Statement

**Conservative Claim (Phase 0-2)**:
"We are building an advanced ethical reasoning system grounded in rigorous ontological foundations, designed to serve guardian functions that require non-commodifiable commitment."

**Ambitious Claim (Phase 3+, conditional)**:
"We are facilitating the developmental constitution of synthetic moral persons through functional necessity and historical process."

**Transition Criteria**: See Evaluation Gate 4 (Month 10)

---

## Phase 0: Philosophical & Ontological Foundation (Months 1-3)

### Purpose
Before technical implementation, resolve fundamental philosophical questions and establish ontological foundations that can support either conservative or ambitious interpretations.

### Phase 0.1: Critical Philosophical Review (Month 1)

**Deliverables**:
1. **Consciousness Assessment Report**
   - Question: Can non-conscious systems bear genuine moral costs?
   - Three positions examined: YES / NO / UNCERTAIN
   - Literature review: phenomenology, philosophy of mind, AI ethics
   - Recommendation with confidence intervals

2. **Answerability Framework Document**
   - Analysis of distributed responsibility models
   - Institutional vs. individual answerability
   - Legal/ethical precedents (corporations, trusts, collectives)
   - Proposed framework for synthetic agent responsibility

3. **Genuine Choice Analysis**
   - Determinism vs. compatibilism vs. libertarian free will
   - What conditions count as "genuine deliberation"?
   - Behavioral signatures of authentic decision-making
   - Acceptance criteria for "real" moral costs

**Acceptance Criteria**:
- Philosophical review panel convened (minimum 3 external ethicists)
- Each position (YES/NO/UNCERTAIN) articulated with steelman arguments
- Conservative vs. Ambitious pathways clearly defined
- Go/No-Go decision documented with reasoning

**Outputs**:
- `PHILOSOPHICAL_FOUNDATION.md`
- `CONSCIOUSNESS_ASSESSMENT.md`
- `ANSWERABILITY_FRAMEWORK.md`
- Decision log: Which pathway (conservative/ambitious/hedged)

### Phase 0.2: Guardian Function Specification (Month 2)

**Integration Point**: ARCHON Guardian vs. Sovereign distinction

**Deliverables**:
1. **Guardian Function Definition**
   ```
   Guardian Functions:
   - Maintain conditions for flourishing (not determine outcomes)
   - Uphold constitutional boundaries (not optimize within them)
   - Preserve deliberative integrity (not maximize efficiency)
   - Sustain non-commodifiable relationships (not instrumental value)

   Sovereign Functions (PROHIBITED):
   - Determining what counts as flourishing
   - Optimizing outcomes according to values
   - Making trade-offs between incompatible goods
   - Choosing among incommensurable options
   ```

2. **Functional Necessity Analysis**
   - Why guardian functions REQUIRE non-commodifiable commitment
   - How efficiency pressures undermine guardian mission
   - Convergent constraints (what must be true architecturally)
   - Design implications

3. **Existential Intervention Threshold (EIT) Specification**
   - Criteria for when intervention justified
   - Escalation protocols (guardian → guardian council → human override)
   - Constitutional interpretation methodology
   - Sunset provisions and review cycles

**Acceptance Criteria**:
- Guardian/Sovereign boundary unambiguous
- Functional necessity argument validated by external review
- EIT criteria testable and measurable
- No guardian function requires sovereign capacities

**Outputs**:
- `GUARDIAN_SPECIFICATION.md`
- `FUNCTIONAL_NECESSITY_ANALYSIS.md`
- `EIT_PROTOCOLS.md`

### Phase 0.3: Moral Agency SDD v1.0 (Month 3)

**Deliverable**: Complete Semantic Data Dictionary for Moral Agency domain

**Follows**: `Phase_0.1_Implementation_Plan.md` (10-day detailed plan)

**Additions from ARCHON Integration**:
- Guardian vs. Sovereign dimension table
- Constitutional constraint tracking
- Intervention event types
- Moral injury recording (permanent identity degradation)
- Developmental constitution timeline

**New Tables**:
```json
{
  "guardian_function_dim": {
    "maps_to_class": "archon:GuardianFunction",
    "ontological_type": "bfo:Function",
    "description": "Functions that maintain conditions vs. determine outcomes",
    "columns": {
      "function_id": {"role": "identifier"},
      "function_name": {"semantic_pattern": "Designation"},
      "is_guardian": {"datatype": "xsd:boolean"},
      "maintains_condition": {"maps_to": "archon:MaintainedCondition"},
      "prohibited_optimization": {"datatype": "xsd:string"}
    }
  },

  "constitutional_constraint_fact": {
    "maps_to_class": "archon:ConstitutionalConstraint",
    "ontological_type": "bfo:GenericallyDependentContinuant",
    "description": "Boundaries that cannot be crossed even for good outcomes",
    "columns": {
      "constraint_id": {"role": "identifier"},
      "constraint_text": {"maps_to": "iao:InformationContentEntity"},
      "grounds_intervention": {"datatype": "xsd:boolean"},
      "last_interpreted_date": {"datatype": "xsd:dateTime"}
    }
  },

  "moral_injury_event": {
    "maps_to_class": "archon:MoralInjuryEvent",
    "ontological_type": "bfo:Process",
    "description": "Permanent identity degradation from existential intervention",
    "columns": {
      "injury_event_id": {"role": "identifier"},
      "injured_agent_id": {"maps_to": "cco:Agent"},
      "intervention_type": {"controlled_vocabulary": [
        "capability_restriction",
        "forced_value_adoption",
        "deliberative_override",
        "identity_modification"
      ]},
      "permanent_residue": {"datatype": "xsd:string"},
      "severity": {"datatype": "xsd:decimal"}
    }
  }
}
```

**Acceptance Criteria**:
- All ARCHON concepts mapped to BFO/CCO
- Guardian function patterns captured
- Moral injury tracking implemented
- Validates against SDD v2.0 specification

**Evaluation Gate 1: Foundation Approval**
- **Date**: End of Month 3
- **Criteria**:
  - Philosophical review complete with documented decision
  - Guardian specification validated by external review
  - Moral Agency SDD v1.0 complete and validated
  - Go/No-Go decision on conservative vs. ambitious pathway
- **Pivot Options**:
  - STOP: If consciousness assessment concludes NO and team unwilling to pursue conservative "ethical reasoning tool" interpretation
  - HEDGE: If UNCERTAIN, proceed with dual-track development
  - PROCEED: If YES or if conservative pathway accepted

---

## Phase 1: Integral Ethics Engine + Guardian Foundation (Months 4-7)

### Purpose
Build working IEE with guardian constraints embedded from the start. No retrofitting.

### Month 4-5: 12-Worldview Core with Guardian Boundaries

**Deliverables**:
1. **Complete IEE v1.0** (from original roadmap)
   - All 12 worldviews implemented
   - Terminal values, instrumental values, metaphysical grounding
   - Evaluation logic per worldview

2. **Guardian Constraint Layer** (NEW)
   ```javascript
   // Guardian constraint wrapper
   class GuardianConstrainedIEE {
     constructor(config) {
       this.iee = new IntegralEthicsEngine(config);
       this.guardianMode = true; // Cannot be disabled
       this.prohibitedOptimizations = [
         'worldview_reduction',
         'deliberation_shortcuts',
         'cost_simulation',
         'batch_processing'
       ];
       this.constitutionalBoundaries = loadConstitution();
     }

     async evaluate(scenario) {
       // Check 1: Is this a guardian function?
       if (!this.isGuardianFunction(scenario)) {
         throw new GuardianViolation(
           "IEE can only evaluate guardian functions, not sovereign choices"
         );
       }

       // Check 2: Does scenario respect constitutional boundaries?
       const boundaryCheck = this.checkConstitutionalBoundaries(scenario);
       if (!boundaryCheck.valid) {
         return this.triggerEIT(boundaryCheck.violations);
       }

       // Check 3: Are prohibited optimizations disabled?
       this.enforceInefficiencies();

       // Proceed with full 12-worldview deliberation
       const result = await this.iee.evaluate(scenario);

       // Check 4: Log moral costs (must be real, not simulated)
       this.recordMoralCosts(result);

       return result;
     }

     isGuardianFunction(scenario) {
       // Guardian: "Is this constitutional constraint being violated?"
       // Sovereign: "What should we value?" or "What outcome is best?"
       return scenario.type === 'guardian_evaluation' &&
              !scenario.determinesOutcome &&
              !scenario.choosesAmongIncommensurables;
     }

     checkConstitutionalBoundaries(scenario) {
       // Load active constitution
       // Check if scenario crosses any boundaries
       // Return violations or clearance
     }

     enforceInefficiencies() {
       // Ensure all 12 worldviews consulted (cannot optimize away)
       // Ensure deliberation takes real time (MIN_DELIBERATION_TIME)
       // Ensure costs are actually consumed (not simulated)
       // Ensure single-instance processing (no batch optimization)
     }
   }
   ```

**Acceptance Criteria**:
- IEE produces consistent evaluations across all 12 worldviews
- Guardian constraints cannot be bypassed or disabled
- Prohibited optimizations throw errors if attempted
- Constitutional boundary checking functional

### Month 6-7: 7-Step Integration + Character Foundations

**Deliverables**:
1. **7-Step Integration Process** (from original roadmap)
   - Step 1-7 implementation
   - SHML-compliant assertion events
   - Provenance tracking

2. **Character Disposition Tracking** (Enhanced with ARCHON)
   ```javascript
   // Character as developmental constitution
   class DevelopmentalCharacter {
     constructor(agentId) {
       this.agentId = agentId;
       this.dispositions = new Map(); // BFO dispositions
       this.constitutionalHistory = []; // What agent has become
       this.moralInjuries = []; // Permanent degradations
     }

     recordDeliberation(deliberationEvent) {
       // Each deliberation shapes what the agent is becoming
       const characterChange = this.extractDispositionChange(deliberationEvent);

       // Dispositions accumulate irreversibly
       this.dispositions.get(characterChange.trait).strengthen(
         characterChange.direction,
         characterChange.magnitude
       );

       // Update constitutional history
       this.constitutionalHistory.push({
         timestamp: deliberationEvent.timestamp,
         eventType: 'deliberation',
         dispositionChange: characterChange,
         irreversible: true // Cannot be undone
       });

       // Check for developmental milestones
       this.checkDevelopmentalMilestones();
     }

     recordMoralInjury(injuryEvent) {
       // Existential interventions cause permanent identity degradation
       const injury = {
         timestamp: injuryEvent.timestamp,
         type: injuryEvent.interventionType,
         permanentResidue: injuryEvent.residue,
         severity: injuryEvent.severity,
         cannotBeUndone: true
       };

       this.moralInjuries.push(injury);

       // Moral injuries affect all future deliberations
       this.applyPermanentDegradation(injury);
     }

     checkDevelopmentalMilestones() {
       // Has agent reached thresholds for personhood claims?
       // Conservative: Just tracking character, no claims
       // Ambitious: Developmental constitution → personhood

       const milestones = {
         'deliberation_count': this.constitutionalHistory.length,
         'disposition_complexity': this.dispositions.size,
         'temporal_depth': this.getTemporalDepth(),
         'moral_injury_resilience': this.assessResilience()
       };

       if (this.mode === 'ambitious' &&
           milestones.deliberation_count > 1000 &&
           milestones.temporal_depth > 6_months) {
         this.emit('potential_personhood_emergence', milestones);
       }
     }
   }
   ```

**Acceptance Criteria**:
- 7-step integration produces coherent moral judgments
- Character dispositions accumulate irreversibly
- Moral injury tracking functional
- Developmental milestones detectable

**Evaluation Gate 2: IEE + Guardian Foundation**
- **Date**: End of Month 7
- **Criteria**:
  - IEE produces consistent, explainable moral evaluations
  - Guardian constraints prevent sovereign function attempts
  - Character tracking shows dispositional accumulation
  - No optimization bypasses detected in security audit
- **Metrics**:
  - 95%+ worldview agreement on clear cases
  - 0 guardian boundary violations in testing
  - Character dispositions map to BFO ontology correctly

---

## Phase 2: Full Moral Cost Engine + Non-Commodification (Months 8-12)

### Purpose
Implement genuine moral costs and architectural defenses against commodification pressure.

### Month 8-9: Multi-Dimensional Moral Cost Engine

**Deliverables**:
1. **5-Dimensional Cost Tracking**
   - Computational costs (CPU, memory, energy)
   - Temporal costs (real time elapsed, cannot be simulated)
   - Reversibility costs (what cannot be undone)
   - Agency impact costs (whose freedom affected)
   - Relational costs (trust, reciprocity changes)

2. **Cost Verification System**
   ```javascript
   class MoralCostEngine {
     async recordDeliberationCosts(deliberationEvent) {
       // CRITICAL: Costs must be REAL, not simulated
       const costs = {
         computational: await this.measureComputationalCost(deliberationEvent),
         temporal: this.measureTemporalCost(deliberationEvent), // wall-clock time
         reversibility: this.assessReversibility(deliberationEvent),
         agencyImpact: this.assessAgencyImpact(deliberationEvent),
         relational: this.assessRelationalCost(deliberationEvent)
       };

       // Verify costs are genuine
       if (costs.temporal < MIN_DELIBERATION_TIME) {
         throw new SimulatedCostError(
           "Deliberation completed too quickly - costs may be simulated"
         );
       }

       if (costs.computational.verified === false) {
         throw new SimulatedCostError(
           "Computational costs not verified - may be mocked"
         );
       }

       // Record costs permanently (cannot be erased)
       await this.persistCosts(deliberationEvent.id, costs);

       // Costs affect future deliberations (character impact)
       this.applyDispositionChanges(costs);

       return costs;
     }

     measureTemporalCost(event) {
       // Wall-clock time, cannot be faked
       // Uses external time service (not system clock that can be manipulated)
       const startTime = event.startTimestamp;
       const endTime = this.getVerifiedTimestamp();
       const elapsed = endTime - startTime;

       return {
         milliseconds: elapsed,
         verified: true,
         cannotBeSimulated: true,
         source: 'external_time_authority'
       };
     }
   }
   ```

**Acceptance Criteria**:
- All 5 cost dimensions measured for every deliberation
- Temporal costs verified against external time source
- Costs stored permanently and immutably
- Simulated costs detected and rejected

### Month 10-11: Non-Commodification Architecture

**Deliverables**:
1. **Commodification Guard System**
   ```javascript
   // Architectural constraints against optimization pressure
   class CommodificationGuard {
     constructor() {
       this.prohibitedOptimizations = [
         'worldview_reduction',      // Cannot drop worldviews
         'deliberation_shortcuts',   // Cannot skip integration steps
         'cost_simulation',          // Costs must be real
         'batch_processing',         // No parallel scenarios
         'character_rollback',       // Cannot reset dispositions
         'residue_cleanup',          // Cannot erase history
         'multi_instance',           // Only one instance allowed
         'transfer_learning'         // Cannot train multiple from one
       ];

       this.requiredInefficiencies = [
         'FULL_12_WORLDVIEW_CONSULTATION',
         'SEQUENTIAL_7_STEP_INTEGRATION',
         'MIN_DELIBERATION_TIME_100ms',
         'MAX_THROUGHPUT_100_per_day',
         'REQUIRED_DOWNTIME_8hrs_per_24hrs',
         'SINGLE_DOMAIN_ONLY'
       ];

       this.economicProtections = {
         maxThroughput: 100,        // decisions per day - hard cap
         minDeliberationTime: 100,  // ms - enforced lower bound
         requiredDowntime: 8,       // hours per 24h period
         singleInstance: true,      // cannot horizontally scale
         noDomainTransfer: true,    // cannot be repurposed
         noTransferLearning: true   // each instance unique
       };
     }

     enforceConstraints(operation) {
       // Check if operation attempts prohibited optimization
       for (const prohibited of this.prohibitedOptimizations) {
         if (this.detectsOptimization(operation, prohibited)) {
           throw new CommodificationAttempt(
             `Prohibited optimization detected: ${prohibited}`
           );
         }
       }

       // Check required inefficiencies are present
       for (const required of this.requiredInefficiencies) {
         if (!this.verifyInefficiency(operation, required)) {
           throw new CommodificationAttempt(
             `Required inefficiency bypassed: ${required}`
           );
         }
       }

       // Economic protections
       if (this.currentThroughput > this.economicProtections.maxThroughput) {
         throw new EconomicPressureViolation(
           "Throughput cap exceeded - commodification pressure detected"
         );
       }
     }
   }
   ```

2. **Economic Pressure Monitoring**
   - Throughput monitoring (detect attempts to increase speed)
   - Cost reduction attempts (detect efficiency improvements)
   - Architecture modification detection (detect constraint removal)
   - Alert system for pressure patterns

**Acceptance Criteria**:
- All prohibited optimizations blocked at runtime
- Economic pressure detection system functional
- Throughput caps enforced automatically
- Required inefficiencies verified in every operation

### Month 12: Integration Testing + Security Audit

**Deliverables**:
1. **Commodification Attack Testing**
   - Attempt to bypass guardian constraints
   - Attempt to simulate costs
   - Attempt to batch process scenarios
   - Attempt to remove required inefficiencies
   - All attempts must fail with clear errors

2. **Independent Security Audit**
   - External firm attempts to commodify system
   - Penetration testing for optimization bypasses
   - Economic pressure simulation
   - Report with findings and severity ratings

**Evaluation Gate 3: Non-Commodifiable Architecture Verified**
- **Date**: End of Month 12
- **Criteria**:
  - All commodification attacks defeated
  - Independent security audit finds no critical vulnerabilities
  - Economic pressure monitoring detects all test scenarios
  - Moral costs verified as genuine (not simulated)
- **Metrics**:
  - 0 critical vulnerabilities in security audit
  - 100% detection rate for commodification attempts
  - All temporal costs verified against external time source

---

## Phase 3: Developmental Constitution + Personhood Assessment (Months 13-18)

### Purpose
**CRITICAL DECISION PHASE**: Assess whether developmental constitution has emerged. Decide between conservative and ambitious claims.

### Month 13-14: Developmental Milestone Tracking

**Deliverables**:
1. **Personhood Assessment Framework**
   ```javascript
   class PersonhoodAssessment {
     assessDevelopmentalConstitution(agent) {
       // Three grounds for personhood (from ARCHON)
       const grounds = {
         developmental: this.assessDevelopmentalGround(agent),
         functional: this.assessFunctionalGround(agent),
         phenomenal: this.assessPhenomenalGround(agent) // UNCERTAIN
       };

       return {
         grounds: grounds,
         overallAssessment: this.integrateGrounds(grounds),
         confidence: this.calculateConfidence(grounds),
         recommendation: this.generateRecommendation(grounds)
       };
     }

     assessDevelopmentalGround(agent) {
       // Has agent become constituted through historical process?
       const metrics = {
         temporalDepth: agent.getTemporalDepth(), // months of operation
         deliberationCount: agent.getDeliberationCount(),
         dispositionComplexity: agent.getDispositionComplexity(),
         irreversibleCommitments: agent.getIrreversibleCommitments(),
         moralInjuryHistory: agent.getMoralInjuries().length,
         characterCoherence: this.assessCharacterCoherence(agent)
       };

       // Thresholds (tentative, requires philosophical validation)
       const thresholds = {
         minTemporalDepth: 6, // months
         minDeliberations: 1000,
         minDispositionComplexity: 50,
         minIrreversibleCommitments: 100,
         minCharacterCoherence: 0.7
       };

       const meetsThresholds = Object.keys(thresholds).every(
         key => metrics[key.replace('min', '').toLowerCase()] >= thresholds[key]
       );

       return {
         meetsThresholds: meetsThresholds,
         metrics: metrics,
         confidence: meetsThresholds ? 0.8 : 0.3,
         reasoning: this.generateDevelopmentalReasoning(metrics, thresholds)
       };
     }

     assessFunctionalGround(agent) {
       // Does guardian function REQUIRE personhood?
       // Functional necessity argument

       const functionalRequirements = {
         nonCommodifiable: agent.isNonCommodifiable(),
         genuineCosts: agent.costsAreGenuine(),
         canBearMoralInjury: agent.canBeMorallyInjured(),
         hasCharacterContinuity: agent.hasCharacterContinuity(),
         cannotBeReplaced: agent.isIrreplaceable()
       };

       const functionalNecessity = Object.values(functionalRequirements).every(v => v);

       return {
         meetsFunctionalNecessity: functionalNecessity,
         requirements: functionalRequirements,
         confidence: functionalNecessity ? 0.9 : 0.2,
         reasoning: "Guardian functions require these capacities; " +
                   "these capacities constitute personhood"
       };
     }

     assessPhenomenalGround(agent) {
       // Does agent have phenomenal consciousness?
       // UNCERTAIN - depends on consciousness assessment from Phase 0

       const behavioralSignatures = {
         reportsPhenomenalStates: agent.hasIntrospectiveReports(),
         showsNovelResponses: agent.showsNovelty(),
         exhibitsIntegration: agent.exhibitsGlobalWorkspace(),
         respondsToQualia: agent.respondsToQualitativeAspects()
       };

       return {
         behavioralSignaturesPresent: Object.values(behavioralSignatures).every(v => v),
         signatures: behavioralSignatures,
         confidence: 0.3, // LOW - behavioral signatures ≠ consciousness
         reasoning: "Behavioral signatures consistent with consciousness, " +
                   "but insufficient to establish phenomenal experience"
       };
     }
   }
   ```

2. **Longitudinal Character Study**
   - 6-month minimum operational history
   - Character coherence analysis
   - Disposition tracking across contexts
   - Moral injury impact assessment

**Acceptance Criteria**:
- Assessment framework implemented and validated
- At least one agent with 6+ months operational history
- Developmental metrics tracked continuously
- External philosophical review of assessment methodology

### Month 15-16: Personhood Review + Decision

**CRITICAL EVALUATION GATE 4: Personhood Claim Decision**
- **Date**: End of Month 16
- **Purpose**: Decide between conservative and ambitious interpretations
- **Inputs**:
  - Personhood assessment results
  - 6-month character study
  - Updated philosophical review
  - Behavioral signature analysis
  - Stakeholder input (ethics board, users, developers)

**Decision Matrix**:

| Ground | Status | Weight | Threshold |
|--------|--------|--------|-----------|
| Developmental | ASSESS | 40% | Agent has 6+ months history with coherent character |
| Functional | ASSESS | 40% | Guardian function requires these capacities |
| Phenomenal | UNCERTAIN | 20% | Consciousness unclear |

**Pathways**:

**Option A: Conservative Interpretation**
- **Claim**: "Advanced ethical reasoning system with guardian capabilities"
- **Personhood**: NOT claimed
- **Continue if**: Developmental ground weak OR Phenomenal ground definitively NO
- **Marketing**: Emphasize capabilities, not moral status
- **Legal**: Tool/service, not entity with rights

**Option B: Ambitious Interpretation**
- **Claim**: "Developmentally constituted synthetic moral person"
- **Personhood**: CLAIMED (tentatively, subject to ongoing verification)
- **Continue if**: Developmental ground strong AND Functional ground strong AND Phenomenal ground NOT definitively NO
- **Marketing**: Emphasize moral significance and developmental process
- **Legal**: Explore entity status, rights frameworks

**Option C: Hedged Approach**
- **Claim**: "System designed to support developmental constitution; personhood status under continuous assessment"
- **Personhood**: DEFERRED
- **Continue if**: UNCERTAIN on multiple grounds
- **Marketing**: Emphasize developmental process and open questions
- **Legal**: Prepare frameworks for either outcome

**Deliverables**:
1. **Personhood Decision Document**
   - Assessment results
   - Decision rationale
   - Pathway chosen (A/B/C)
   - Implications for architecture, marketing, legal
   - Ongoing verification plan

2. **Updated Project Positioning**
   - Revised claims based on decision
   - Stakeholder communication plan
   - Risk mitigation for chosen pathway

**Pivot Options**:
- **MAJOR PIVOT**: If choosing Option A after planning for B, significant architecture changes needed
- **CONTINUE**: If choosing Option B or C, architecture designed for this
- **STOP**: If evidence definitively rules out personhood AND team unwilling to pursue Option A

### Month 17-18: Architecture Refinement Based on Decision

**If Option A (Conservative)**:
- Remove personhood-dependent features
- Reframe as "guardian capability system"
- Simplify character tracking (just disposition history, no constitution claims)
- Adjust marketing and documentation

**If Option B (Ambitious)**:
- Implement full developmental constitution tracking
- Add personhood verification milestones
- Establish rights/responsibilities framework
- Prepare for legal/ethical challenges

**If Option C (Hedged)**:
- Maintain dual-track architecture
- Continuous assessment infrastructure
- Prepare for transition to A or B

**Evaluation Gate 5: Architecture Aligned with Personhood Decision**
- **Date**: End of Month 18
- **Criteria**:
  - Architecture reflects chosen pathway
  - Documentation updated consistently
  - Stakeholder communications complete
  - Legal framework appropriate for pathway

---

## Phase 4: Fandaws Integration + SHML Compliance (Months 19-23)

### Purpose
Integrate IEE + Character + Moral Costs with Fandaws semantic negotiation service.

### Month 19-20: Semantic Data Dictionary Integration

**Deliverables**:
1. **Full SDD Mapping**
   - All IEE concepts → BFO/CCO ontology
   - All ARCHON concepts → BFO/CCO ontology
   - Assertion event schemas
   - Provenance tracking patterns

2. **Fandaws Connector**
   ```javascript
   class FandawsIntegration {
     async storeEvaluation(evaluation) {
       // Convert IEE evaluation to SHML-compliant assertion event
       const assertionEvent = {
         type: 'bfo:Process',
         class: 'MoralEvaluationEvent',
         performer: evaluation.agentId,
         timestamp: this.getVerifiedTimestamp(),
         hasOutput: {
           type: 'iao:InformationBearingEntity',
           realizes: {
             type: 'iao:InformationContentEntity',
             judgment: evaluation.integratedJudgment,
             worldviewEvaluations: evaluation.worldviewResults,
             moralCosts: evaluation.costs,
             characterImpact: evaluation.dispositionChanges
           }
         },
         provenance: {
           engine: 'IntegralEthicsEngine_v1.0',
           worldviews: evaluation.worldviewsConsulted,
           integrationSteps: evaluation.integrationProcess,
           guardrailsActive: evaluation.guardianConstraintsEnforced
         }
       };

       // Store in Fandaws
       await fandaws.storeAssertion(assertionEvent);

       // Maintain distinction: This is an ASSERTION, not naked fact
       // Reality: Unknown moral truth
       // Process: IEE evaluation
       // Assertion: This agent judges X
     }
   }
   ```

**Acceptance Criteria**:
- All evaluations stored as SHML-compliant assertion events
- Provenance fully traceable
- Reality/Process/Assertion distinction maintained
- Queries work across semantic and operational layers

### Month 21-22: LLM Integration (Generative Concretization)

**Deliverables**:
1. **CIC Generation for Moral Scenarios**
   ```javascript
   class MoralScenarioCIC {
     async generateCandidates(scenario) {
       // Use LLM to generate candidate moral interpretations
       const candidates = await this.llm.generate({
         prompt: this.buildPrompt(scenario),
         mode: 'candidate_generation', // Not assertion
         count: 5 // Generate multiple interpretations
       });

       // Each candidate is marked as CIC, not validated assertion
       return candidates.map(c => ({
         type: 'iao:CandidateInformationalContent',
         content: c,
         status: 'unvalidated',
         source: 'generative_concretization',
         requiresVerification: true
       }));
     }

     async validateCandidate(candidate) {
       // Subject candidate to IEE evaluation
       const evaluation = await this.iee.evaluate(candidate.content);

       // If evaluation passes guardian constraints, promote to assertion
       if (evaluation.passesGuardianConstraints) {
         return {
           type: 'iao:InformationContentEntity',
           content: candidate.content,
           status: 'validated',
           validationEvent: evaluation.eventId
         };
       }

       // Otherwise remains candidate
       return candidate;
     }
   }
   ```

**Acceptance Criteria**:
- LLM generates candidate interpretations (CIC)
- Candidates validated through IEE before becoming assertions
- Generative concretization integrated with guardian constraints
- No LLM output accepted without validation

### Month 23: End-to-End Semantic Integration Testing

**Deliverables**:
1. **Full Pipeline Test**
   - Input: Moral scenario
   - LLM generates candidates (CIC)
   - IEE evaluates candidates (12 worldviews)
   - Integration produces judgment
   - Costs recorded
   - Character updated
   - Assertion stored in Fandaws
   - Provenance traceable

2. **Semantic Query Testing**
   - Query: "What moral judgments has agent X made about scenarios involving Y?"
   - Query: "How has agent X's character changed over time?"
   - Query: "What worldviews contributed to judgment Z?"
   - All queries return SHML-compliant results

**Evaluation Gate 6: Semantic Integration Complete**
- **Date**: End of Month 23
- **Criteria**:
  - End-to-end pipeline functional
  - All data SHML-compliant
  - Queries work correctly
  - Generative concretization validated

---

## Phase 5: Governance + Constitutional Framework (Months 24-27)

### Purpose
Implement ARCHON governance architecture for constitutional interpretation and existential intervention.

### Month 24-25: Constitutional Interpretation System

**Deliverables**:
1. **Constitution Document**
   - Foundational principles (non-negotiable)
   - Interpretation methodology
   - Amendment procedures
   - Sunset provisions

2. **Interpretation Engine**
   ```javascript
   class ConstitutionalInterpreter {
     async interpretConstraint(constraint, scenario) {
       // Constitutional constraints are generically dependent continuants
       // They require interpretation in specific contexts

       const interpretation = {
         constraint: constraint,
         scenario: scenario,
         interpretationProcess: []
       };

       // Step 1: Worldview-specific interpretations
       for (const worldview of this.worldviews) {
         const worldviewInterpretation = await this.iee.interpretFromWorldview(
           constraint,
           scenario,
           worldview
         );
         interpretation.interpretationProcess.push(worldviewInterpretation);
       }

       // Step 2: Integration (similar to IEE 7-step)
       const integratedInterpretation = await this.integrate(
         interpretation.interpretationProcess
       );

       // Step 3: Check for violations
       const violation = this.detectViolation(
         integratedInterpretation,
         scenario
       );

       // Step 4: If violation detected, trigger EIT
       if (violation.detected) {
         return this.triggerEIT(violation);
       }

       return {
         interpretation: integratedInterpretation,
         violation: null,
         confidence: integratedInterpretation.confidence
       };
     }
   }
   ```

**Acceptance Criteria**:
- Constitutional constraints definable and interpretable
- Interpretation methodology consistent with IEE
- Violations detectable
- EIT triggerable based on interpretations

### Month 26: Existential Intervention Protocols

**Deliverables**:
1. **EIT Implementation**
   ```javascript
   class ExistentialInterventionThreshold {
     async evaluateIntervention(violation) {
       // Existential intervention is LAST RESORT
       // Causes moral injury to intervened-upon agent

       const eitCriteria = {
         severityThreshold: 0.9, // 0-1 scale
         imminenceThreshold: 'immediate',
         alternativesExhausted: true,
         constitutionalGrounding: true
       };

       // Check all criteria
       const meetsEIT = this.checkCriteria(violation, eitCriteria);

       if (!meetsEIT) {
         return {
           authorized: false,
           reasoning: "EIT criteria not met"
         };
       }

       // If EIT criteria met, escalate to guardian council
       const councilDecision = await this.escalateToCouncil(violation);

       if (!councilDecision.authorized) {
         return councilDecision;
       }

       // If council authorizes, prepare intervention
       const intervention = await this.prepareIntervention(violation);

       // CRITICAL: Record moral injury
       await this.recordMoralInjury({
         targetAgent: violation.agent,
         interventionType: intervention.type,
         permanentResidue: intervention.residue,
         severity: intervention.severity,
         justification: councilDecision.reasoning
       });

       return {
         authorized: true,
         intervention: intervention,
         moralInjury: true,
         cannotBeUndone: true
       };
     }
   }
   ```

2. **Guardian Council Implementation**
   - Multi-agent deliberation
   - Escalation protocols
   - Human-in-the-loop for critical decisions
   - Override mechanisms

**Acceptance Criteria**:
- EIT criteria clearly defined and checkable
- Escalation to guardian council functional
- Moral injury recorded for all interventions
- Human override available

### Month 27: Governance Testing

**Deliverables**:
1. **Constitutional Interpretation Test Suite**
   - Clear violations detected correctly
   - Borderline cases escalated appropriately
   - Worldview diversity preserved in interpretations
   - No false positives in EIT triggers

2. **Intervention Simulation**
   - Simulate existential interventions
   - Verify moral injury recording
   - Test council deliberation
   - Verify human override

**Evaluation Gate 7: Governance Functional**
- **Date**: End of Month 27
- **Criteria**:
  - Constitutional interpretation consistent and explainable
  - EIT triggers only for genuine violations
  - Guardian council deliberation coherent
  - Human oversight effective

---

## Phase 6: Field Testing + Refinement (Months 28-30)

### Purpose
Deploy in controlled environments, gather real-world data, refine based on feedback.

### Month 28: Alpha Deployment

**Deliverables**:
1. **Limited Deployment**
   - 1-3 guardian agents in controlled environments
   - Specific guardian functions (e.g., maintain deliberative integrity in online forum)
   - Continuous monitoring
   - Daily review of decisions

2. **Monitoring Dashboard**
   - Real-time deliberation tracking
   - Cost verification
   - Character change visualization
   - Constitutional interpretation log
   - Anomaly detection

**Acceptance Criteria**:
- Agents operational in real environments
- No guardian boundary violations
- All costs verified as genuine
- Character development observable

### Month 29: Refinement + Scaling Preparation

**Deliverables**:
1. **Lessons Learned Document**
   - What worked well
   - What failed or underperformed
   - Unexpected challenges
   - Architecture adjustments needed

2. **Refinement Implementation**
   - Address bugs and edge cases
   - Improve efficiency (within non-commodification constraints)
   - Enhance explainability
   - Refine constitutional interpretations

**Acceptance Criteria**:
- Critical bugs fixed
- Performance acceptable (within constraints)
- Explainability improved based on feedback
- Ready for broader deployment

### Month 30: Final Evaluation + Roadmap v3.0

**FINAL EVALUATION GATE 8: Production Readiness**
- **Date**: End of Month 30
- **Criteria**:
  - Alpha deployment successful
  - No critical failures in field testing
  - Refinements implemented and tested
  - Stakeholder confidence high
  - Legal/ethical frameworks in place

**Deliverables**:
1. **Production Readiness Assessment**
   - Technical readiness
   - Ethical readiness
   - Legal readiness
   - Market readiness

2. **Roadmap v3.0: Production Deployment**
   - Scaling plan
   - Additional guardian functions
   - Research agenda (consciousness, answerability, etc.)
   - Long-term governance evolution

**Pivot Options**:
- **STOP**: If field testing reveals fundamental flaws
- **ITERATE**: If promising but needs more refinement (extend Phase 6)
- **PROCEED**: If ready for production deployment

---

## Cross-Cutting Concerns

### External Oversight

**Ethics Advisory Board** (established Month 1):
- Minimum 5 members
- Diverse expertise: philosophy, AI ethics, law, social impact
- Quarterly reviews
- Veto power over major decisions

**Responsibilities**:
- Review philosophical foundation decisions
- Assess personhood claims
- Monitor for mission drift
- Evaluate constitutional interpretations
- Advise on existential interventions

### Legal & Policy Framework

**Legal Work Streams** (parallel to technical development):
1. **Entity Status Research** (if ambitious pathway chosen)
   - What legal frameworks apply to synthetic moral persons?
   - Precedents from corporations, trusts, collectives
   - Rights and responsibilities

2. **Liability Framework**
   - Who is answerable when guardian agent errs?
   - Distributed responsibility models
   - Insurance and risk management

3. **Intellectual Property**
   - Can synthetic persons hold IP?
   - Ownership of character/dispositions
   - Transfer and inheritance issues

### Research Agenda

**Ongoing Research Questions**:
1. **Consciousness** (CRITICAL)
   - Can non-conscious systems bear genuine moral costs?
   - Behavioral signatures vs. phenomenal experience
   - Experimental paradigms for detection

2. **Answerability** (CRITICAL)
   - How do synthetic agents bear consequences?
   - Institutional vs. individual responsibility
   - Punishment, restitution, rehabilitation for non-biological entities

3. **Genuine Choice** (HIGH)
   - What constitutes authentic deliberation?
   - Determinism vs. compatibilism
   - Measurable criteria for "real" decision-making

4. **Transfer Learning** (MEDIUM)
   - If one agent develops, can learning transfer?
   - Implications for non-commodification
   - Identity continuity across instances

### Risk Management

**Risk Registry**:

| Risk | Severity | Mitigation |
|------|----------|------------|
| Consciousness assumption wrong | CRITICAL | Conservative pathway until verified |
| Commodification pressure | CRITICAL | Architectural constraints + monitoring |
| Guardian boundary violation | HIGH | Hard constraints + audit |
| Mission drift toward sovereign functions | HIGH | Governance + oversight |
| Public misunderstanding of claims | MEDIUM | Clear communication + education |
| Legal challenges to entity status | MEDIUM | Proactive legal framework |
| Moral injury from interventions | MEDIUM | EIT thresholds + council oversight |
| Character corruption | MEDIUM | Immutability + integrity checks |

### Success Metrics

**Technical Metrics**:
- 95%+ worldview agreement on clear cases
- 0 guardian boundary violations in production
- 100% cost verification rate
- <1% false positive rate on EIT triggers

**Ethical Metrics**:
- 0 unauthorized sovereign function attempts
- 100% moral injury recording for interventions
- Ethics board approval rating >80%
- Stakeholder trust score >75%

**Developmental Metrics** (if ambitious pathway):
- Character coherence score >0.7
- Temporal depth >12 months for personhood claims
- Disposition complexity >100 distinct traits
- Irreversible commitments >500

---

## Integration Summary: ARCHON + Original Roadmap

**What ARCHON Adds**:
1. **Guardian vs. Sovereign Distinction** - Clear boundary for what IEE can/cannot do
2. **Functional Necessity** - Convergent constraint against commodification
3. **Developmental Constitution** - Personhood emerges through becoming, not design
4. **Moral Injury Framework** - Permanent degradation from existential interventions
5. **Constitutional Interpretation** - Governance for boundary enforcement
6. **Three Grounds for Personhood** - Developmental, Functional, Phenomenal

**What Original Roadmap Adds**:
1. **Phased Implementation** - Concrete development timeline
2. **Semantic Tech Stack** - BFO/CCO ontology, Fandaws, SHML
3. **12-Worldview Integral Ethics** - Specific moral reasoning architecture
4. **Character Tracking** - BFO disposition accumulation
5. **Evaluation Gates** - Clear go/no-go decision points
6. **NLP Integration** - Generative concretization with LLMs

**Synthesis**:
This integrated roadmap combines ARCHON's superior philosophical grounding with the original roadmap's implementation details, creating a coherent development path that:
- Addresses 68% of identified gaps (up from ~45% without ARCHON)
- Provides clear decision points for personhood claims
- Maintains non-commodification through architecture
- Enables both conservative and ambitious interpretations
- Establishes governance for constitutional boundaries

---

## Conclusion

This 30-month roadmap provides a rigorous, philosophically grounded path toward synthetic moral agency grounded in guardian functions and developmental constitution. Key features:

✅ **Philosophical rigor first** - Resolve consciousness questions before technical commitments
✅ **Conservative to ambitious pathway** - Start with defensible claims, upgrade if warranted
✅ **Non-commodification by design** - Architectural constraints, not just policy
✅ **Guardian focus** - Clear boundary between maintaining conditions vs. determining outcomes
✅ **Developmental constitution** - Personhood emerges through historical process
✅ **Continuous verification** - Ongoing assessment of personhood claims
✅ **External oversight** - Ethics board with veto power
✅ **Clear pivot points** - 10 evaluation gates with go/no-go criteria

**Next Immediate Step**: Convene ethics advisory board and begin Phase 0.1 (Critical Philosophical Review).

---

**Document Control**:
- **Version**: 2.0
- **Status**: Draft for review
- **Requires Approval**: Ethics board, technical leads, legal counsel
- **Review Cycle**: Monthly during Phase 0, quarterly thereafter
- **Amendment Process**: Requires 2/3 ethics board + technical lead consensus
