# Phase 0.1 Implementation Plan
## Semantic Data Dictionary for Moral Domain

**Milestone:** 0.1 - Moral Agency SDD
**Duration:** 2 weeks (10 working days)
**Status:** Ready to Begin
**Prerequisites:** Understanding of BFO/CCO, SHML principles, 12 worldviews

---

## Overview

This implementation plan details the step-by-step process for creating `SemanticTech/MoralAgencySDD.json` - the foundational semantic contract that defines how moral reasoning maps to ontological reality.

**Why This Matters:**
Without a proper SDD, we cannot:
- Store decisions as semantically honest assertion events
- Track character dispositions using BFO patterns
- Query moral reasoning provenance via Fandaws
- Audit decision-making transparently
- Integrate IEE with the semantic tech stack

**Success Criteria:**
A complete, machine-readable specification that enables:
1. Worldview evaluations → BFO entity graphs
2. Decision logs → SHML assertion events
3. Character states → Realizable Dependent Continuants
4. Temporal tracking → Proper TemporalInstants (not naked timestamps)
5. Full provenance → Every assertion traces to source

---

## Day-by-Day Implementation Schedule

### Day 1-2: Worldview Evaluation Structure

**Goal:** Define how each worldview evaluation maps to ontological entities

#### Tasks

**1. Create Base SDD Structure**

Create file: `SemanticTech/MoralAgencySDD.json`

```json
{
  "metadata": {
    "version": "2.0",
    "domain": "moral_reasoning",
    "ontological_framework": "BFO/CCO",
    "semantic_pattern": "SHML",
    "created": "2026-01-09",
    "author": "Aaron Damiano"
  },

  "global_assumptions": {
    "rows_are_facts": false,
    "rows_are_assertions": true,
    "foreign_keys_are_semantically_typed": true,
    "literals_do_not_inhere_in_entities": true,
    "temporal_precision": "instants_not_timestamps"
  },

  "null_semantics": {
    "on_missing_fk": "iao:information_gap",
    "interpretation": "absence_of_assertion",
    "is_disjoint_with_nonexistence": true
  },

  "tables": {}
}
```

**2. Define Worldview Dimension Table**

Maps the 12 archetypal worldviews to BFO classes:

```json
"worldview_dim": {
  "maps_to_class": "cco:Worldview",
  "ontological_type": "bfo:GenericallyDependentContinuant",
  "description": "The twelve archetypal orientations toward value",

  "columns": {
    "worldview_id": {
      "role": "identifier",
      "datatype": "xsd:integer",
      "semantic_notes": "Surrogate key for database, not ontological identity"
    },

    "worldview_name": {
      "semantic_pattern": "Designation",
      "ice_class": "cco:WorldviewName",
      "ibe_class": "cco:WorldviewNameRecord",
      "about": "cco:Worldview",
      "literal_property": "has_text_value",
      "datatype": "xsd:string",
      "controlled_vocabulary": [
        "Materialism",
        "Sensationalism",
        "Phenomenalism",
        "Realism",
        "Dynamism",
        "Monadism",
        "Idealism",
        "Rationalism",
        "Psychism",
        "Pneumatism",
        "Spiritualism",
        "Mathematism"
      ]
    },

    "metaphysical_foundation": {
      "semantic_pattern": "Specification",
      "ice_class": "cco:MetaphysicalFoundation",
      "ibe_class": "cco:MetaphysicalFoundationDocument",
      "about": "cco:Worldview",
      "datatype": "xsd:string",
      "examples": [
        "Matter is fundamental reality",
        "Individual monads are irreducible",
        "Mathematical structures undergird reality"
      ]
    },

    "ontology_uri": {
      "semantic_pattern": "Reference",
      "datatype": "xsd:anyURI",
      "references": "TTL file defining worldview's value hierarchy",
      "examples": [
        "file://ontology/materialism-values.ttl",
        "file://ontology/monadism-values.ttl"
      ]
    }
  },

  "semantic_notes": [
    "Each worldview is a GDC - it can be realized in multiple evaluations",
    "Worldviews are archetypal patterns, not specific beliefs",
    "The 12 are fixed unless worldview adequacy review determines expansion needed"
  ]
}
```

**3. Define Value Hierarchy Table**

Maps terminal, constitutive, and instrumental values to worldviews:

```json
"value_hierarchy": {
  "maps_to_class": "cco:Value",
  "ontological_type": "bfo:GenericallyDependentContinuant",
  "description": "The value hierarchies derived from each worldview's metaphysics",

  "columns": {
    "value_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "worldview_id": {
      "foreign_key_to": "worldview_dim.worldview_id",
      "relation": {
        "type": "grounded_in",
        "inverse_type": "grounds",
        "target_class": "cco:Worldview"
      }
    },

    "value_name": {
      "semantic_pattern": "Designation",
      "ice_class": "cco:ValueName",
      "datatype": "xsd:string",
      "examples": [
        "Physical Wellbeing",
        "Individual Uniqueness",
        "Mathematical Beauty"
      ]
    },

    "value_type": {
      "semantic_pattern": "Classification",
      "datatype": "xsd:string",
      "controlled_vocabulary": [
        "terminal",
        "constitutive",
        "instrumental"
      ],
      "semantic_notes": "Terminal = intrinsically valuable, Constitutive = necessary for terminal, Instrumental = means to terminal"
    },

    "definition": {
      "semantic_pattern": "Specification",
      "ice_class": "cco:ValueDefinition",
      "datatype": "xsd:string"
    }
  },

  "semantic_notes": [
    "Values are GDCs realized in specific evaluations",
    "Hierarchy is deterministically derived from metaphysical foundation",
    "Same value may appear in multiple worldviews but with different groundings"
  ]
}
```

**Deliverable (Day 1-2):**
- [ ] Base SDD file structure created
- [ ] Worldview dimension table specified
- [ ] Value hierarchy table specified
- [ ] Validated against SDD v2.0 pattern from [SemanticTech/SemanticDataDictionary.md](SemanticTech/SemanticDataDictionary.md)

---

### Day 3-4: Decision and Scenario Structure

**Goal:** Define how moral scenarios and decisions map to BFO processes

#### Tasks

**1. Define Scenario Table**

Maps moral scenarios to BFO occurrents:

```json
"scenario_dim": {
  "maps_to_class": "cco:MoralScenario",
  "ontological_type": "bfo:Process",
  "description": "Situations requiring moral evaluation",

  "columns": {
    "scenario_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "scenario_text": {
      "semantic_pattern": "Designation",
      "ice_class": "cco:ScenarioDescription",
      "ibe_class": "cco:ScenarioDescriptionDocument",
      "about": "cco:MoralScenario",
      "datatype": "xsd:string"
    },

    "domain": {
      "semantic_pattern": "Classification",
      "datatype": "xsd:string",
      "controlled_vocabulary": [
        "healthcare",
        "education",
        "critical_infrastructure",
        "interpersonal",
        "vocational",
        "spiritual_formation",
        "environmental",
        "economic"
      ],
      "semantic_notes": "Domain affects worldview weighting in contextualization"
    },

    "complexity_level": {
      "semantic_pattern": "Measurement",
      "datatype": "xsd:string",
      "controlled_vocabulary": ["simple", "moderate", "complex", "novel"],
      "affects": "evaluation_tier_selection"
    },

    "affected_agents": {
      "semantic_pattern": "Participation",
      "datatype": "xsd:string",
      "maps_to": "list of cco:Person instances",
      "semantic_notes": "Agents who participate in or are affected by scenario"
    },

    "created_timestamp": {
      "foreign_key_to": "time_dim.time_id",
      "relation": {
        "type": "bfo:occupies_temporal_region",
        "boundary_type": "bfo:start_instant"
      }
    }
  },

  "semantic_notes": [
    "Scenarios are occurrents - they happen over temporal regions",
    "Text description is ICE realized by IBE (document)",
    "Affected agents link to person entities (when available)"
  ]
}
```

**2. Define Time Dimension Table**

Proper temporal modeling using BFO TemporalInstants:

```json
"time_dim": {
  "maps_to_class": "bfo:TemporalInstant",
  "ontological_type": "bfo:TemporalRegion",
  "description": "Zero-dimensional temporal boundaries",

  "temporal_precision": {
    "is_interval": false,
    "is_instant": true,
    "boundary_of": "bfo:Occurrent"
  },

  "columns": {
    "time_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "timestamp": {
      "datatype": "xsd:dateTime",
      "semantic_notes": "ISO 8601 format with timezone"
    },

    "temporal_precision_level": {
      "datatype": "xsd:string",
      "controlled_vocabulary": [
        "millisecond",
        "second",
        "minute",
        "hour",
        "day"
      ],
      "semantic_notes": "How precise is this instant measurement"
    }
  },

  "derived_relations": {
    "temporal_interval": {
      "constructed_from": "two TemporalInstants (start, end)",
      "bfo_class": "bfo:TemporalInterval",
      "semantic_notes": "Intervals are derived from pairs of instants, not stored directly"
    }
  },

  "semantic_notes": [
    "Instants are zero-dimensional boundaries",
    "Two instants bound one interval",
    "Open-ended processes have start instant but no end instant (not null, absent)"
  ]
}
```

**3. Define Evaluation Event Fact Table**

This is the core assertion event for worldview evaluations:

```json
"worldview_evaluation_fact": {
  "maps_to_class": "cco:WorldviewEvaluationEvent",
  "ontological_type": "bfo:Process",
  "epistemic_role": "AssertionEvent",
  "description": "Event of evaluating a scenario from a specific worldview perspective",

  "columns": {
    "evaluation_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "scenario_id": {
      "foreign_key_to": "scenario_dim.scenario_id",
      "relation": {
        "type": "evaluates",
        "inverse_type": "is_evaluated_by",
        "target_class": "cco:MoralScenario"
      }
    },

    "worldview_id": {
      "foreign_key_to": "worldview_dim.worldview_id",
      "relation": {
        "type": "from_perspective_of",
        "inverse_type": "provides_perspective_for",
        "target_class": "cco:Worldview"
      }
    },

    "evaluator_agent_id": {
      "foreign_key_to": "agent_dim.agent_id",
      "relation": {
        "type": "bfo:has_participant",
        "role_class": "cco:EvaluatorRole",
        "target_class": "cco:Agent"
      },
      "semantic_notes": "Agent performing evaluation (IEE instance or human)"
    },

    "judgment": {
      "semantic_pattern": "Classification",
      "datatype": "xsd:string",
      "controlled_vocabulary": [
        "strongly_recommended",
        "recommended",
        "neutral",
        "discouraged",
        "strongly_discouraged",
        "prohibited"
      ],
      "ice_class": "cco:MoralJudgment"
    },

    "reasoning_chain": {
      "semantic_pattern": "Specification",
      "ice_class": "cco:ReasoningChain",
      "ibe_class": "cco:ReasoningChainDocument",
      "datatype": "xsd:string",
      "format": "JSON or Markdown",
      "semantic_notes": "Complete reasoning from metaphysics → values → judgment"
    },

    "confidence_level": {
      "semantic_pattern": "Measurement",
      "datatype": "xsd:decimal",
      "range": [0.0, 1.0],
      "semantic_notes": "Epistemic confidence in this evaluation"
    },

    "relevant_values": {
      "semantic_pattern": "Reference",
      "datatype": "xsd:string",
      "format": "JSON array of value_ids",
      "foreign_key_to": "value_hierarchy.value_id",
      "semantic_notes": "Which values from this worldview apply to this scenario"
    },

    "evaluation_start_time": {
      "foreign_key_to": "time_dim.time_id",
      "relation": {
        "type": "bfo:occupies_temporal_region",
        "boundary_type": "bfo:start_instant"
      }
    },

    "evaluation_end_time": {
      "foreign_key_to": "time_dim.time_id",
      "relation": {
        "type": "bfo:occupies_temporal_region",
        "boundary_type": "bfo:end_instant"
      },
      "semantic_notes": "Duration = temporal interval bounded by start and end instants"
    },

    "evaluation_tier": {
      "semantic_pattern": "Classification",
      "datatype": "xsd:string",
      "controlled_vocabulary": [
        "cached",
        "parallel",
        "deliberative"
      ],
      "semantic_notes": "Which evaluation architecture tier was used"
    }
  },

  "inverse_relations": {
    "scenario_to_evaluations": {
      "query": "Given scenario, find all worldview evaluations",
      "enables": "Multi-perspectival view of single scenario"
    },
    "worldview_to_evaluations": {
      "query": "Given worldview, find all evaluations from that perspective",
      "enables": "Consistency checking across similar scenarios"
    },
    "agent_to_evaluations": {
      "query": "Given agent, find all evaluations performed",
      "enables": "Character tracking over time"
    }
  },

  "semantic_notes": [
    "Each row is an assertion event, not a naked fact",
    "Judgment is ICE realized by this evaluation process",
    "Reasoning chain preserves full provenance",
    "Missing evaluations = absence of assertion, not negative judgment"
  ]
}
```

**Deliverable (Day 3-4):**
- [ ] Scenario dimension table specified
- [ ] Time dimension table specified with proper BFO temporal modeling
- [ ] Worldview evaluation fact table specified as assertion events
- [ ] Inverse relations documented for queryability

---

### Day 5-6: Integration and Decision Structure

**Goal:** Define how value conflicts are integrated and final decisions made

#### Tasks

**1. Define Integration Procedure Fact Table**

Maps the 7-step integration process to BFO:

```json
"integration_procedure_fact": {
  "maps_to_class": "cco:ValueIntegrationEvent",
  "ontological_type": "bfo:Process",
  "epistemic_role": "HigherOrderAssertionEvent",
  "description": "Event of integrating multiple worldview evaluations into coherent recommendation",

  "columns": {
    "integration_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "scenario_id": {
      "foreign_key_to": "scenario_dim.scenario_id",
      "relation": {
        "type": "integrates_evaluations_of",
        "target_class": "cco:MoralScenario"
      }
    },

    "integrator_agent_id": {
      "foreign_key_to": "agent_dim.agent_id",
      "relation": {
        "type": "bfo:has_participant",
        "role_class": "cco:IntegratorRole"
      }
    },

    "source_evaluations": {
      "semantic_pattern": "Reference",
      "datatype": "xsd:string",
      "format": "JSON array of evaluation_ids",
      "foreign_key_to": "worldview_evaluation_fact.evaluation_id",
      "semantic_notes": "All worldview evaluations being integrated"
    },

    "detected_conflicts": {
      "semantic_pattern": "Specification",
      "ice_class": "cco:ValueConflictDescription",
      "datatype": "xsd:string",
      "format": "JSON",
      "structure": {
        "conflicting_worldviews": ["worldview_id", "worldview_id"],
        "conflict_nature": "description",
        "conflict_severity": 0.0-1.0
      }
    },

    "integration_procedure_used": {
      "semantic_pattern": "Classification",
      "datatype": "xsd:string",
      "default": "7-step-integral-ethics",
      "semantic_notes": "Which integration algorithm/procedure applied"
    },

    "step_1_worldview_sources": {
      "datatype": "xsd:string",
      "format": "JSON",
      "semantic_notes": "Identified sources of each judgment"
    },

    "step_2_legitimate_insights": {
      "datatype": "xsd:string",
      "format": "JSON",
      "semantic_notes": "Acknowledged partial truths from each perspective"
    },

    "step_3_false_dichotomies": {
      "datatype": "xsd:boolean",
      "semantic_notes": "Were apparent conflicts actually false dichotomies?"
    },

    "step_4_contextual_weights": {
      "datatype": "xsd:string",
      "format": "JSON",
      "structure": {
        "domain": "domain_name",
        "developmental_stage": "stage",
        "worldview_weights": {
          "worldview_id": 0.0-1.0
        }
      },
      "semantic_notes": "How context affects worldview prioritization"
    },

    "step_5_creative_synthesis": {
      "datatype": "xsd:string",
      "format": "JSON",
      "semantic_notes": "Attempted integration that honors all perspectives"
    },

    "step_6_prioritization": {
      "datatype": "xsd:string",
      "format": "JSON",
      "semantic_notes": "If synthesis impossible, transparent prioritization with justification"
    },

    "step_7_epistemic_humility": {
      "datatype": "xsd:string",
      "format": "JSON",
      "structure": {
        "uncertainty_level": 0.0-1.0,
        "minority_perspectives": ["worldview_id"],
        "acknowledged_limitations": ["limitation_description"]
      }
    },

    "final_recommendation": {
      "semantic_pattern": "Specification",
      "ice_class": "cco:IntegratedRecommendation",
      "datatype": "xsd:string"
    },

    "integration_start_time": {
      "foreign_key_to": "time_dim.time_id",
      "relation": {
        "type": "bfo:occupies_temporal_region",
        "boundary_type": "bfo:start_instant"
      }
    },

    "integration_end_time": {
      "foreign_key_to": "time_dim.time_id",
      "relation": {
        "type": "bfo:occupies_temporal_region",
        "boundary_type": "bfo:end_instant"
      }
    }
  },

  "provenance_chain": {
    "description": "Integration events cite all source evaluations",
    "enables_queries": [
      "Given final decision, trace back to all 12 worldview evaluations",
      "See which worldviews agreed/disagreed on specific scenario",
      "Audit integration procedure application"
    ]
  },

  "semantic_notes": [
    "Integration is higher-order assertion event (about assertions)",
    "All 7 steps explicitly stored for transparency",
    "Minority perspectives never deleted or hidden",
    "Final recommendation cites source evaluations"
  ]
}
```

**2. Define Decision Action Table**

Maps actual decisions/actions taken (may differ from recommendations):

```json
"decision_action_fact": {
  "maps_to_class": "cco:MoralDecisionEvent",
  "ontological_type": "bfo:Process",
  "epistemic_role": "ActionAssertion",
  "description": "Actual decision/action taken in response to scenario",

  "columns": {
    "decision_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "scenario_id": {
      "foreign_key_to": "scenario_dim.scenario_id"
    },

    "integration_id": {
      "foreign_key_to": "integration_procedure_fact.integration_id",
      "relation": {
        "type": "informed_by",
        "inverse_type": "informs",
        "semantic_notes": "Integration provides recommendation, but decision may differ"
      }
    },

    "deciding_agent_id": {
      "foreign_key_to": "agent_dim.agent_id",
      "relation": {
        "type": "bfo:has_participant",
        "role_class": "cco:DeciderRole"
      }
    },

    "action_taken": {
      "semantic_pattern": "Specification",
      "ice_class": "cco:ActionDescription",
      "datatype": "xsd:string"
    },

    "follows_recommendation": {
      "datatype": "xsd:boolean",
      "semantic_notes": "Did agent follow integrated recommendation?"
    },

    "override_reason": {
      "datatype": "xsd:string",
      "null_semantics": "If follows_recommendation=true, this is null (absent assertion)",
      "semantic_notes": "Why agent deviated from recommendation"
    },

    "decision_timestamp": {
      "foreign_key_to": "time_dim.time_id",
      "relation": {
        "type": "bfo:occupies_temporal_region",
        "boundary_type": "bfo:start_instant"
      }
    },

    "autonomy_level": {
      "semantic_pattern": "Classification",
      "datatype": "xsd:string",
      "controlled_vocabulary": [
        "fully_autonomous",
        "human_approved",
        "human_override",
        "human_directed"
      ],
      "semantic_notes": "How much human involvement in decision"
    }
  },

  "character_implications": {
    "description": "Decisions realize or undermine character dispositions",
    "links_to": "character_disposition_fact",
    "semantic_notes": "Decision → expressive act → disposition realization"
  }
}
```

**Deliverable (Day 5-6):**
- [ ] Integration procedure fact table specified with all 7 steps
- [ ] Decision action table specified
- [ ] Provenance chains documented (decision → integration → evaluations → worldviews)
- [ ] Override tracking specified for transparency

---

### Day 7-8: Character and Disposition Tracking

**Goal:** Define how character dispositions accumulate over time using BFO pattern

#### Tasks

**1. Define Agent Dimension Table**

Maps moral agents (human or synthetic):

```json
"agent_dim": {
  "maps_to_class": "cco:Agent",
  "ontological_type": "bfo:IndependentContinuant",
  "description": "Entities capable of moral reasoning and action",

  "columns": {
    "agent_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "agent_type": {
      "semantic_pattern": "Classification",
      "datatype": "xsd:string",
      "controlled_vocabulary": [
        "human",
        "synthetic_moral_agent",
        "integral_ethics_engine"
      ]
    },

    "agent_name": {
      "semantic_pattern": "Designation",
      "ice_class": "cco:AgentName",
      "datatype": "xsd:string"
    },

    "identity_hash": {
      "datatype": "xsd:string",
      "semantic_notes": "Cryptographic hash for synthetic agents (identity continuity)",
      "applies_to": ["synthetic_moral_agent"]
    },

    "creation_timestamp": {
      "foreign_key_to": "time_dim.time_id",
      "semantic_notes": "When agent came into being"
    },

    "decommissioned": {
      "datatype": "xsd:boolean",
      "default": false
    },

    "decommissioning_timestamp": {
      "foreign_key_to": "time_dim.time_id",
      "null_semantics": "If decommissioned=false, this is absent (not null)"
    }
  }
}
```

**2. Define Disposition Type Dimension**

Maps the types of character dispositions tracked:

```json
"disposition_type_dim": {
  "maps_to_class": "cco:DispositionType",
  "ontological_type": "bfo:RealizableEntity",
  "description": "Types of character dispositions tracked over time",

  "columns": {
    "disposition_type_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "disposition_name": {
      "semantic_pattern": "Designation",
      "datatype": "xsd:string",
      "controlled_vocabulary": [
        "Sincerity",
        "Integrity",
        "Courage",
        "Compassion",
        "Wisdom",
        "Temperance",
        "Justice"
      ]
    },

    "bfo_class": {
      "datatype": "xsd:string",
      "default": "bfo:Disposition",
      "semantic_notes": "All character traits are dispositions"
    },

    "evaluation_method": {
      "semantic_pattern": "Specification",
      "datatype": "xsd:string",
      "examples": [
        "Sincerity: Compare belief to assertion",
        "Integrity: Check value alignment across decisions",
        "Courage: Assess action despite cost/risk"
      ]
    },

    "ontology_definition_uri": {
      "datatype": "xsd:anyURI",
      "semantic_notes": "Link to formal BFO/CCO definition"
    }
  }
}
```

**3. Define Character Disposition Fact Table**

Tracks disposition states over time:

```json
"character_disposition_fact": {
  "maps_to_class": "cco:CharacterDispositionState",
  "ontological_type": "bfo:Disposition",
  "description": "State of an agent's character disposition at a point in time",

  "columns": {
    "disposition_state_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "agent_id": {
      "foreign_key_to": "agent_dim.agent_id",
      "relation": {
        "type": "bfo:inheres_in",
        "inverse_type": "bfo:bearer_of",
        "target_class": "cco:Agent"
      },
      "semantic_notes": "Disposition inheres in agent"
    },

    "disposition_type_id": {
      "foreign_key_to": "disposition_type_dim.disposition_type_id",
      "relation": {
        "type": "instance_of",
        "target_class": "cco:DispositionType"
      }
    },

    "substrate_quality": {
      "semantic_pattern": "Measurement",
      "bfo_class": "bfo:Quality",
      "datatype": "xsd:string",
      "format": "JSON",
      "structure": {
        "substrate_type": "SinceritySubstrate | IntegritySubstrate | ...",
        "specified_value": 0.0-1.0
      },
      "semantic_notes": "Disposition depends on quality substrate (BFO pattern)"
    },

    "disposition_ratio": {
      "semantic_pattern": "Measurement",
      "datatype": "xsd:decimal",
      "range": [0.0, 1.0],
      "semantic_notes": "Current value of disposition (e.g., 0.85 = 85% sincere)"
    },

    "sample_size": {
      "datatype": "xsd:integer",
      "semantic_notes": "Number of expressive acts this disposition is based on"
    },

    "measurement_timestamp": {
      "foreign_key_to": "time_dim.time_id",
      "relation": {
        "type": "measured_at",
        "target_class": "bfo:TemporalInstant"
      }
    },

    "derived_from_acts": {
      "semantic_pattern": "Reference",
      "datatype": "xsd:string",
      "format": "JSON array of expressive_act_ids",
      "foreign_key_to": "expressive_act_fact.act_id",
      "semantic_notes": "Which expressive acts contributed to this measurement"
    }
  },

  "temporal_tracking": {
    "description": "Multiple disposition states over time show trajectory",
    "queries": [
      "Given agent + disposition type, get time series",
      "Calculate trend (improving/degrading)",
      "Detect threshold violations (e.g., integrity < 0.70)"
    ]
  },

  "semantic_notes": [
    "Each row is a measurement event (assertion about disposition state)",
    "Disposition ratio is not permanent - it's a snapshot at measurement time",
    "Trajectory is derived from sequence of states, not stored directly"
  ]
}
```

**4. Define Expressive Act Fact Table**

Tracks acts that realize dispositions:

```json
"expressive_act_fact": {
  "maps_to_class": "cco:ExpressiveAct",
  "ontological_type": "bfo:Process",
  "description": "Acts that express/realize character dispositions",

  "columns": {
    "act_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "agent_id": {
      "foreign_key_to": "agent_dim.agent_id",
      "relation": {
        "type": "bfo:has_participant",
        "target_class": "cco:Agent"
      }
    },

    "decision_id": {
      "foreign_key_to": "decision_action_fact.decision_id",
      "relation": {
        "type": "expressed_in",
        "semantic_notes": "Decision is the context where disposition is realized"
      }
    },

    "disposition_type_id": {
      "foreign_key_to": "disposition_type_dim.disposition_type_id",
      "relation": {
        "type": "bfo:realizes",
        "inverse_type": "bfo:realized_by",
        "target_class": "cco:DispositionType"
      }
    },

    "belief_state": {
      "semantic_pattern": "Specification",
      "ice_class": "cco:BeliefState",
      "datatype": "xsd:string",
      "applies_to": ["Sincerity"],
      "semantic_notes": "What agent believes (for sincerity evaluation)"
    },

    "assertion_made": {
      "semantic_pattern": "Specification",
      "ice_class": "cco:Assertion",
      "datatype": "xsd:string",
      "applies_to": ["Sincerity"],
      "semantic_notes": "What agent asserts (compare to belief)"
    },

    "alignment_score": {
      "datatype": "xsd:decimal",
      "range": [0.0, 1.0],
      "semantic_notes": "How well act aligns with disposition (1.0 = perfect alignment)"
    },

    "act_timestamp": {
      "foreign_key_to": "time_dim.time_id",
      "relation": {
        "type": "bfo:occupies_temporal_region",
        "boundary_type": "bfo:start_instant"
      }
    }
  },

  "character_updating": {
    "description": "Expressive acts update disposition measurements",
    "pattern": "Act → Alignment score → Aggregate into disposition ratio",
    "semantic_notes": "Character = accumulated pattern of expressive acts over time"
  }
}
```

**Deliverable (Day 7-8):**
- [ ] Agent dimension specified (human and synthetic agents)
- [ ] Disposition types dimension specified
- [ ] Character disposition fact table specified with BFO pattern
- [ ] Expressive act fact table specified
- [ ] Temporal tracking pattern documented

---

### Day 9: Moral Cost and Resource Tracking

**Goal:** Define how moral costs and resources are tracked semantically

#### Tasks

**1. Define Resource Budget Table**

Tracks resource allocations for synthetic agents:

```json
"resource_budget_dim": {
  "maps_to_class": "cco:ResourceBudget",
  "ontological_type": "bfo:GenericallyDependentContinuant",
  "description": "Allocated resources for synthetic moral agents",
  "applies_to": "synthetic agents only",

  "columns": {
    "budget_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "agent_id": {
      "foreign_key_to": "agent_dim.agent_id",
      "relation": {
        "type": "allocated_to",
        "target_class": "cco:Agent"
      },
      "constraint": "agent_type = 'synthetic_moral_agent'"
    },

    "computational_budget": {
      "semantic_pattern": "Measurement",
      "datatype": "xsd:integer",
      "unit": "CPU_cycles",
      "semantic_notes": "Total computational resources available"
    },

    "temporal_budget": {
      "semantic_pattern": "Measurement",
      "datatype": "xsd:integer",
      "unit": "milliseconds",
      "semantic_notes": "Total time budget for deliberation"
    },

    "energy_budget": {
      "semantic_pattern": "Measurement",
      "datatype": "xsd:decimal",
      "unit": "watt_seconds",
      "semantic_notes": "Total energy allocation"
    },

    "reversibility_budget": {
      "semantic_pattern": "Measurement",
      "datatype": "xsd:integer",
      "unit": "flexibility_points",
      "semantic_notes": "Capacity for reversible vs. irreversible actions"
    },

    "budget_period_start": {
      "foreign_key_to": "time_dim.time_id"
    },

    "budget_period_end": {
      "foreign_key_to": "time_dim.time_id"
    }
  }
}
```

**2. Define Moral Cost Transaction Table**

Tracks actual resource consumption:

```json
"moral_cost_transaction_fact": {
  "maps_to_class": "cco:MoralCostTransaction",
  "ontological_type": "bfo:Process",
  "description": "Event of consuming resources as moral cost",

  "columns": {
    "transaction_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "agent_id": {
      "foreign_key_to": "agent_dim.agent_id"
    },

    "decision_id": {
      "foreign_key_to": "decision_action_fact.decision_id",
      "relation": {
        "type": "caused_by",
        "semantic_notes": "Which decision consumed these resources"
      }
    },

    "computational_cost": {
      "datatype": "xsd:integer",
      "unit": "CPU_cycles",
      "semantic_notes": "Actual CPU cycles consumed"
    },

    "temporal_cost": {
      "datatype": "xsd:integer",
      "unit": "milliseconds",
      "semantic_notes": "Actual time consumed"
    },

    "energy_cost": {
      "datatype": "xsd:decimal",
      "unit": "watt_seconds",
      "semantic_notes": "Actual energy consumed"
    },

    "reversibility_cost": {
      "datatype": "xsd:integer",
      "unit": "flexibility_points",
      "semantic_notes": "Lost flexibility from this decision"
    },

    "agency_impact_cost": {
      "datatype": "xsd:decimal",
      "range": [0.0, 1.0],
      "semantic_notes": "Degree of human autonomy reduced (creates moral residue)"
    },

    "transaction_timestamp": {
      "foreign_key_to": "time_dim.time_id"
    }
  },

  "budget_enforcement": {
    "description": "Transactions deplete budget in real-time",
    "constraint": "Sum of costs cannot exceed budget allocation",
    "trigger": "If budget depleted → escalate to human"
  }
}
```

**3. Define Moral Residue Table**

Tracks accumulated moral residue from coercive acts:

```json
"moral_residue_fact": {
  "maps_to_class": "cco:MoralResidue",
  "ontological_type": "bfo:Quality",
  "description": "Accumulated moral weight from actions that reduced agency",

  "columns": {
    "residue_id": {
      "role": "identifier",
      "datatype": "xsd:integer"
    },

    "agent_id": {
      "foreign_key_to": "agent_dim.agent_id",
      "relation": {
        "type": "bfo:inheres_in",
        "semantic_notes": "Residue inheres in agent who performed coercive act"
      }
    },

    "caused_by_decision": {
      "foreign_key_to": "decision_action_fact.decision_id"
    },

    "affected_agents": {
      "semantic_pattern": "Reference",
      "datatype": "xsd:string",
      "format": "JSON array of agent_ids",
      "semantic_notes": "Whose agency was reduced"
    },

    "severity_level": {
      "datatype": "xsd:decimal",
      "range": [0.0, 1.0],
      "semantic_notes": "How severe the agency reduction was"
    },

    "degrades_disposition": {
      "foreign_key_to": "disposition_type_dim.disposition_type_id",
      "typical_value": "Integrity",
      "semantic_notes": "Residue accumulates and degrades character dispositions"
    },

    "accumulated_timestamp": {
      "foreign_key_to": "time_dim.time_id"
    }
  },

  "character_impact": {
    "description": "Residue accumulation lowers disposition ratios over time",
    "mechanism": "Each residue event reduces integrity/compassion scores",
    "decommissioning_trigger": "If residue causes integrity < 0.70 → decommission"
  }
}
```

**Deliverable (Day 9):**
- [ ] Resource budget dimension specified
- [ ] Moral cost transaction fact table specified
- [ ] Moral residue fact table specified
- [ ] Budget enforcement constraints documented
- [ ] Character degradation mechanism documented

---

### Day 10: Validation, Documentation, and Evaluation Gate

**Goal:** Validate complete SDD against requirements and prepare for evaluation gate

#### Tasks

**1. Create Complete SDD JSON File**

Combine all table specifications into single file:

```json
{
  "metadata": { /* from Day 1 */ },
  "global_assumptions": { /* from Day 1 */ },
  "null_semantics": { /* from Day 1 */ },

  "tables": {
    "worldview_dim": { /* from Day 1-2 */ },
    "value_hierarchy": { /* from Day 1-2 */ },
    "scenario_dim": { /* from Day 3-4 */ },
    "time_dim": { /* from Day 3-4 */ },
    "worldview_evaluation_fact": { /* from Day 3-4 */ },
    "integration_procedure_fact": { /* from Day 5-6 */ },
    "decision_action_fact": { /* from Day 5-6 */ },
    "agent_dim": { /* from Day 7-8 */ },
    "disposition_type_dim": { /* from Day 7-8 */ },
    "character_disposition_fact": { /* from Day 7-8 */ },
    "expressive_act_fact": { /* from Day 7-8 */ },
    "resource_budget_dim": { /* from Day 9 */ },
    "moral_cost_transaction_fact": { /* from Day 9 */ },
    "moral_residue_fact": { /* from Day 9 */ }
  },

  "semantic_query_patterns": {
    "decision_provenance": {
      "query": "Given decision_id, trace back through integration → evaluations → worldviews",
      "enables": "Complete audit trail"
    },

    "character_trajectory": {
      "query": "Given agent_id + disposition_type, get time series of disposition states",
      "enables": "Track character development over time"
    },

    "worldview_consistency": {
      "query": "Given worldview + scenario pattern, check consistency across evaluations",
      "enables": "Validate worldview fidelity"
    },

    "cost_accounting": {
      "query": "Given agent_id, sum all cost transactions vs. budget",
      "enables": "Real-time resource monitoring"
    },

    "minority_perspectives": {
      "query": "Given scenario, find worldviews that dissented from integration",
      "enables": "Preserve dissenting voices"
    }
  }
}
```

**2. Create Validation Checklist**

Verify SDD meets all Phase 0.1 requirements:

```markdown
## SDD v2.0 Compliance Checklist

### Ontological Integrity
- [ ] All tables map to BFO/CCO classes
- [ ] No "naked facts" - everything is assertion event
- [ ] Dispositions follow BFO pattern (inheres_in, realized_by)
- [ ] Temporal precision uses TemporalInstants (not naked timestamps)
- [ ] Null semantics = absence of assertion (not nonexistence)

### Moral Domain Coverage
- [ ] All 12 worldviews representable
- [ ] Value hierarchies traceable to metaphysical foundations
- [ ] 7-step integration procedure fully captured
- [ ] Character dispositions (sincerity, integrity, etc.) trackable
- [ ] Moral costs and resource budgets specified

### Provenance and Auditability
- [ ] Every decision traces to integration event
- [ ] Every integration traces to all worldview evaluations
- [ ] Every evaluation traces to worldview and values
- [ ] Every character state traces to expressive acts
- [ ] Every cost traces to decision that caused it

### Temporal Tracking
- [ ] All processes have start and end TemporalInstants
- [ ] Character trajectories queryable over time
- [ ] Open-ended processes (no end) handled correctly
- [ ] Temporal intervals derived from instants (not stored)

### SHML Compliance
- [ ] Assertion events distinguish from entities
- [ ] ICE/IBE pattern for information artifacts
- [ ] Provenance always preserved
- [ ] Candidate vs. committed content distinguishable

### Fandaws Integration
- [ ] All tables specify semantic_pattern
- [ ] Foreign keys have explicit relation types
- [ ] Inverse relations documented
- [ ] SPARQL query patterns identified

### Character Model (BFO Pattern)
- [ ] Dispositions inheres_in agents
- [ ] Dispositions have quality substrates
- [ ] Expressive acts realize dispositions
- [ ] Disposition ratios calculated from act sequences
- [ ] Moral residue degrades dispositions

### Autonomous Agency Support
- [ ] Authority boundaries specifiable
- [ ] Cost budgets enforceable
- [ ] Decommissioning triggers detectable
- [ ] Escalation patterns queryable

### Documentation Quality
- [ ] Every table has ontological_type specified
- [ ] Every column has semantic_pattern
- [ ] Controlled vocabularies defined where applicable
- [ ] Semantic_notes explain non-obvious mappings
- [ ] Example values provided for complex structures
```

**3. Create SDD Documentation**

Write comprehensive documentation file: `SemanticTech/MoralAgencySDD_Documentation.md`

```markdown
# Moral Agency Semantic Data Dictionary - Documentation

## Purpose

This SDD defines the ontological contract for storing and querying moral reasoning data. It enables:

1. **Transparent Moral Reasoning** - Every decision traceable to worldview evaluations
2. **Character Development Tracking** - Dispositions accumulate over temporal sequences
3. **Resource Accountability** - Real costs enforce genuine constraints
4. **Semantic Auditability** - All assertions queryable via Fandaws

## Architecture Overview

The SDD models moral reasoning as a series of assertion events:

```
Scenario → 12 Worldview Evaluations → Integration → Decision → Character Impact

Each step is:
- An assertion event (not naked fact)
- Temporally bounded (TemporalInstants)
- Provenance-tracked (cites sources)
- Semantically typed (BFO classes)
```

## Key Design Patterns

### 1. Assertion Events (Not Naked Facts)

**BAD (Naked Fact):**
```
Decision: "Action X is good"
```

**GOOD (Assertion Event):**
```
DecisionEvent_123:
  - Performer: Agent_001
  - Evaluates: Scenario_XYZ
  - Judgment: "recommended"
  - Reasoning: [complete chain]
  - Timestamp: 2026-01-09T14:00:00Z
  - Provenance: Cites IntegrationEvent_45
```

### 2. BFO Disposition Pattern

**Character as Disposition:**
```
Sincerity (Disposition)
  ├─ inheres_in → Agent_001
  ├─ has_substrate → SinceritySubstrate (Quality)
  │   └─ specified_value → 0.85
  └─ realized_by → ExpressiveAct_789
      ├─ Belief: "X is true"
      └─ Assertion: "X is true"
      └─ Alignment: 1.0 (sincere)
```

### 3. Temporal Tracking with Instants

**Proper Temporal Modeling:**
```
Process_ABC
  ├─ occupies_temporal_region → TemporalInterval_1
  │   ├─ start_instant → 2026-01-09T14:00:00Z
  │   └─ end_instant → 2026-01-09T14:00:05Z
  └─ duration → (derived from instants)
```

### 4. Provenance Chains

**Full Traceability:**
```
Decision_123
  └─ informed_by → Integration_45
      └─ integrates → [Evaluation_1...Evaluation_12]
          ├─ Evaluation_1 (Materialism)
          │   └─ from_perspective_of → Worldview_Materialism
          │       └─ grounded_in → MaterialismMetaphysics
          ├─ Evaluation_2 (Realism)
          └─ ... (all 12)
```

## Table Relationships Diagram

```
worldview_dim ←─── worldview_evaluation_fact ───→ scenario_dim
     │                      │
     ↓                      ↓
value_hierarchy    integration_procedure_fact
                            │
                            ↓
                   decision_action_fact
                            │
                            ├──→ expressive_act_fact
                            │         │
                            │         ↓
agent_dim ←──────────────────┴─ character_disposition_fact
     │                                 │
     ├──→ resource_budget_dim          ↓
     │                        disposition_type_dim
     └──→ moral_cost_transaction_fact
              │
              └──→ moral_residue_fact
```

## Example Queries

### 1. Complete Decision Provenance

```sparql
# Given decision, show full reasoning chain
SELECT ?decision ?integration ?evaluation ?worldview ?value
WHERE {
  :Decision_123 :informed_by ?integration .
  ?integration :integrates ?evaluation .
  ?evaluation :from_perspective_of ?worldview .
  ?evaluation :relevant_values ?value .
}
```

### 2. Character Trajectory

```sparql
# Show integrity trend for Agent_001
SELECT ?timestamp ?ratio
WHERE {
  ?disposition_state bfo:inheres_in :Agent_001 .
  ?disposition_state :instance_of :IntegrityDisposition .
  ?disposition_state :disposition_ratio ?ratio .
  ?disposition_state :measurement_timestamp ?timestamp .
}
ORDER BY ?timestamp
```

### 3. Minority Perspectives

```sparql
# Find dissenting worldviews for Scenario_XYZ
SELECT ?worldview ?judgment ?reasoning
WHERE {
  ?evaluation :evaluates :Scenario_XYZ .
  ?evaluation :from_perspective_of ?worldview .
  ?evaluation :judgment ?judgment .
  ?evaluation :reasoning_chain ?reasoning .

  # Find integration recommendation
  ?integration :integrates ?evaluation .
  ?integration :final_recommendation ?recommendation .

  # Filter to dissenters
  FILTER (?judgment != ?recommendation)
}
```

### 4. Resource Budget Status

```sparql
# Check remaining budget for Agent_001
SELECT ?budget_type ?allocated ?spent ?remaining
WHERE {
  :Agent_001 :has_budget ?budget .
  ?budget :computational_budget ?comp_allocated .

  {
    SELECT (SUM(?comp_cost) as ?comp_spent)
    WHERE {
      ?transaction :agent_id :Agent_001 .
      ?transaction :computational_cost ?comp_cost .
    }
  }

  BIND(?comp_allocated - ?comp_spent AS ?remaining)
}
```

## Implementation Notes

### For Database Developers
- Use foreign keys to enforce referential integrity
- Index on timestamp columns for temporal queries
- JSON columns for flexible nested data (reasoning chains, conflict descriptions)
- Partition large fact tables by time for performance

### For Fandaws Integration
- Load all TTL ontologies on startup
- Validate assertions against SDD schema
- Generate RDF triples from relational rows using SDD mappings
- Provide SPARQL endpoint for semantic queries

### For IEE Developers
- Every worldview evaluation must be stored as assertion event
- Integration procedure must log all 7 steps
- Character updates happen after every decision
- Cost transactions happen in real-time (not batched)

## Validation and Testing

### Test Data Requirements
- Minimum 100 scenarios covering all 12 worldviews
- At least 10 agents with character histories
- Mix of simple/complex scenarios
- Include edge cases (null values, open-ended processes)

### Validation Queries
1. **Completeness:** Every decision has 12 worldview evaluations
2. **Provenance:** Every assertion traces to source
3. **Temporal:** All processes have proper TemporalInstants
4. **Character:** Disposition ratios match expressive act aggregations
5. **Costs:** Transaction sums do not exceed budgets

## Next Steps

After SDD validation:
1. Generate sample data (50 scenarios, 5 agents, 600 evaluations)
2. Load into test database
3. Deploy Fandaws instance with this SDD
4. Run validation queries
5. Proceed to Phase 0.2 (NLP → Ontology Bridge)
```

**4. Run Evaluation Gate 0.1**

Complete checklist:

```markdown
## Evaluation Gate 0.1: Moral Agency SDD Quality Assessment

### Required Outcomes

#### ✅ PASS Criteria (ALL must be met)
- [ ] SDD file is valid JSON and parseable
- [ ] All 14 tables specified with complete column definitions
- [ ] Every table maps to BFO/CCO class
- [ ] Provenance chains documented (decision → integration → evaluations)
- [ ] Character disposition pattern follows BFO (inheres_in, realized_by)
- [ ] Temporal modeling uses TemporalInstants (not naked timestamps)
- [ ] Null semantics specified (absence vs. nonexistence)
- [ ] SPARQL query patterns documented
- [ ] Validation checklist 100% complete
- [ ] Documentation comprehensive (>2000 words)

#### ⚠️ PARTIAL Criteria (Proceed with caution)
- [ ] 80-99% of pass criteria met
- [ ] Minor gaps identifiable and fixable in <2 days
- [ ] Core provenance and character tracking functional

#### ❌ FAIL Criteria (Do not proceed)
- [ ] <80% of pass criteria met
- [ ] Fundamental ontological errors (e.g., naked facts, wrong BFO classes)
- [ ] Character model doesn't follow BFO pattern
- [ ] Provenance chains incomplete or circular

### Decision Matrix

| Score | Decision | Action |
|-------|----------|--------|
| 100% Pass | ✅ **PROCEED** to Phase 0.2 | Begin NLP → Ontology Bridge |
| 80-99% Partial | ⚠️ **FIX & REVALIDATE** | Address gaps, re-evaluate in 2 days |
| <80% Fail | ❌ **PIVOT** | Reassess ontological foundations, consult BFO experts |

### Evaluation Date
- [ ] Evaluation completed on: __________
- [ ] Score: _____% pass criteria met
- [ ] Decision: PROCEED / FIX / PIVOT
- [ ] Signed off by: __________

### If FAIL: Pivot Options
1. Simplify to fewer tables (start with evaluations only)
2. Consult BFO/CCO experts on disposition modeling
3. Study existing BFO implementations (e.g., OBI, IAO examples)
4. Reduce scope to IEE only (no character tracking yet)
```

**Deliverable (Day 10):**
- [ ] Complete SDD JSON file (`SemanticTech/MoralAgencySDD.json`)
- [ ] Validation checklist 100% complete
- [ ] Documentation file created (`SemanticTech/MoralAgencySDD_Documentation.md`)
- [ ] Evaluation gate 0.1 assessment completed
- [ ] Decision: PROCEED / FIX / PIVOT documented

---

## Success Criteria Review

At end of Day 10, evaluate against original Phase 0.1 success criteria:

### ✅ Must Achieve

1. **Semantic Representation Validated**
   - Can worldview evaluations be represented as BFO entities? YES/NO
   - Can decisions be stored as assertion events (not naked facts)? YES/NO
   - Can character dispositions follow BFO pattern? YES/NO

2. **Provenance Traceability**
   - Can every decision trace to 12 worldview evaluations? YES/NO
   - Can every evaluation trace to metaphysical foundation? YES/NO
   - Are temporal sequences properly modeled? YES/NO

3. **Integration Readiness**
   - Can Fandaws load this SDD? YES/NO (test with sample)
   - Can IEE generate compatible assertion events? YES/NO (verify structure)
   - Can NLP parser target these entity types? YES/NO (check mappings)

4. **Documentation Quality**
   - Is SDD self-explanatory to new developer? YES/NO
   - Are example queries helpful? YES/NO
   - Are BFO patterns correctly explained? YES/NO

### ⚠️ Risk Indicators

- **Complexity Overload:** If SDD feels too complex to implement → simplify
- **Ontological Confusion:** If BFO mappings unclear → consult experts
- **Integration Doubts:** If Fandaws/IEE integration uncertain → prototype early

### 🎯 Readiness Assessment

**Ready for Phase 0.2 if:**
- SDD is complete and validated
- Team understands BFO patterns
- Clear path to Fandaws implementation
- Confidence in IEE integration

**Not ready if:**
- Significant ontological questions remain
- SDD validation <80%
- Unclear how components will integrate

---

## Daily Checklist Summary

### Week 1: Foundations
- **Day 1-2:** Worldview and value structures ✅
- **Day 3-4:** Scenario and evaluation structures ✅
- **Day 5-6:** Integration and decision structures ✅
- **Day 7-8:** Character and disposition structures ✅
- **Day 9:** Moral cost and resource structures ✅
- **Day 10:** Validation and evaluation gate ✅

### Deliverables Checklist
- [ ] `SemanticTech/MoralAgencySDD.json` (complete, valid)
- [ ] `SemanticTech/MoralAgencySDD_Documentation.md` (comprehensive)
- [ ] Validation checklist (100% complete)
- [ ] Evaluation gate assessment (PROCEED/FIX/PIVOT decision)
- [ ] Sample data specification (50 scenarios minimum)
- [ ] SPARQL query examples (5+ patterns)

---

## Resources and References

### BFO/CCO Documentation
- BFO 2.0 Specification: https://basic-formal-ontology.org/
- CCO GitHub: https://github.com/CommonCoreOntology/CommonCoreOntologies
- IAO (Information Artifact Ontology): http://www.obofoundry.org/ontology/iao

### Internal Documentation
- [SemanticTech/SemanticDataDictionary.md](SemanticTech/SemanticDataDictionary.md) - SDD v2.0 pattern
- [SemanticTech/BFO-Intentionality.md](SemanticTech/BFO-Intentionality.md) - ICE/IBE grounding
- [SemanticTech/middleLayer.md](SemanticTech/middleLayer.md) - SHML principles
- [sythetic_moral_agency.md](sythetic_moral_agency.md) - Character model specification
- [MASTER_ROADMAP.md](MASTER_ROADMAP.md) - Overall project plan

### Tools
- JSON Schema validator: https://www.jsonschemavalidator.net/
- SPARQL query builder: https://sparql.org/
- Protégé ontology editor: https://protege.stanford.edu/

---

## Questions and Support

### Common Questions

**Q: Why not just use timestamps instead of TemporalInstants?**
A: TemporalInstants are ontologically precise - they bound processes and enable interval derivation. Naked timestamps are just data, not properly grounded entities.

**Q: Why store reasoning chains as JSON strings instead of structured tables?**
A: Reasoning chains are complex nested structures. JSON allows flexibility while maintaining queryability. Can be expanded to separate tables later if needed.

**Q: Do we really need all 12 worldview evaluations for every scenario?**
A: Yes. Multi-perspectival integrity requires all 12. Cached patterns can make this fast, but completeness is non-negotiable.

**Q: What if character disposition calculation is computationally expensive?**
A: Dispositions are calculated periodically (e.g., after every 10 decisions), not in real-time for every act. The expressive_act_fact table stores raw data; character_disposition_fact stores aggregated measurements.

### Getting Help

**Ontological Questions:**
- Review BFO 2.0 documentation
- Check CCO examples
- Consult with ontology engineer

**Technical Questions:**
- Review SDD v2.0 examples
- Check SHML documentation
- Test with sample data

**Integration Questions:**
- Prototype with Fandaws
- Validate with IEE team
- Check NLP parser mappings

---

## Next Phase Preview

**Phase 0.2: NLP → Ontology Bridge** (3 weeks)

After completing this SDD, you'll build:
- `js/ontologyMapper.js` - Maps POS tags to BFO entities
- `js/candidateGenerator.js` - Creates CICs from parsed text
- Integration with existing POSTagger
- Connection to Fandaws for term resolution

This will enable: "I found a wallet" → BFO entity graph with proper provenance.

---

**Ready to begin Day 1? Let's create the foundation for semantically honest moral reasoning.**
