# Reclaiming Process Semantics in Realist Ontology: A BFO-Aligned Proposal
for Human-Centric Classification of Biological Events
**Abstract**
While the Basic Formal Ontology (BFO) offers a robust realist framework for
modeling biomedical and biological domains, practical modeling often reveals
tensions between BFO’s ontological rigor and human-centered, domain-specific
classifications. This paper addresses one such challenge: the folk-biological
distinction between “natural” and “premature” fruit drop. We demonstrate that
while these are not ontologically distinct process types under BFO, they can
be meaningfully modeled through configurations of participant qualities and
dispositions. We propose a BFO-consistent pattern that preserves ontological
realism while effectively supporting human-interpretable classification of
processes and discuss its implications for knowledge representation.
## 1. Introduction
In biological and agricultural domains, humans routinely classify processes
based on their perceived normalcy or deviation. A common example is the
distinction between natural and premature fruit drop:
* **Natural fruit drop** is understood as an integral part of the normal
maturation and reproductive cycle of a plant.
* **Premature fruit drop** is perceived as a pathological or stress-induced
deviation from this normal cycle.
These labels strongly imply different process *types* in everyday language
and domain-specific discourse. However, under a strict realist ontology like
BFO, both are realizations of the same fundamental ontological process class:
a fruit detaching from a tree. The tension arises from the necessity to
reconcile these realist ontological commitments with the pragmatic
classification schemes prevalent in scientific and agricultural communication
and knowledge organization.
## 2. The Ontological Challenge
BFO provides a clear and rigorous framework for distinguishing between
different types of entities:
* **Occurrents:** Entities that have temporal parts and unfold in time, such
as a fruit drop process.
* **Continuants:** Entities that persist through time while maintaining their
identity, such as a fruit or a tree.
* **Dependent continuants:** Entities that inhere in and are dependent on
continuants, including qualities (e.g., color, size) and dispositions (e.g.,
fragility, susceptibility to disease).
The core ontological challenge we address is that human classification of
processes often relies heavily on the *context* in which they occur,
particularly the states and qualities of the participating entities, rather
than on fundamental differences in the process itself.
Attempting to directly ontologize these folk distinctions would lead to
problems:

* “Natural Fruit Drop” and “Premature Fruit Drop” would incorrectly be
represented as distinct subclasses of `Fruit Drop Process`.
* This would violate the realist principle that processes are individuated by
what they fundamentally *are* (a specific sequence of events involving
particular participants), not by how humans interpret or categorize them
based on associated circumstances.
## 3. Decomposing the Fruit Drop Process
To establish a BFO-consistent foundation, let us first model the core fruit
drop process, irrespective of human-imposed semantics:
```mermaid
flowchart TD
subgraph Process
P2[Auxin Reduction : Process]
P3[Ethylene Increase : Process]
P4[Abscission Layer Activation : Process]
P5[Enzymatic Activity : Process]
P6[Mechanical Separation : Process]
P7[Protective Scar Formation : Process]
end
subgraph Material Entities
F[Fruit : Material Entity]
T[Tree : Material Entity]
A[Abscission Layer : Fiat Object Part]
end
F -- participates_in --&gt; P2
F -- participates_in --&gt; P3
A -- participates_in --&gt; P4
A -- participates_in --&gt; P5
F -- participates_in --&gt; P6
T -- participates_in --&gt; P7
P2 --&gt; P3 --&gt; P4 --&gt; P5 --&gt; P6 --&gt; P7
In this model, the Fruit Drop Process is understood as an aggregate of temporally related
subprocesses, involving specific participants (the fruit, the tree, and the abscission layer). The
level of granularity chosen here focuses on the key biological events leading to detachment and
subsequent protective measures. Other more granular or higher-level processes could also be
considered, but these represent the core sequence relevant to our distinction.
4. Adding Qualities and Dispositions
The crucial insight for resolving the tension lies in recognizing that the perceived difference
between &quot;normal&quot; and &quot;premature&quot; fruit drop is not rooted in distinct process kinds but rather in
differing states and qualities of the entities participating in that single process kind. These
qualities influence the unfolding and the perceived normalcy of the fruit drop event:
Code snippet
flowchart TD

F[Fruit] --&gt; Q1[Mature Fruit Quality : Quality]
F --&gt; Q2[High Ethylene Level : Quality]
F --&gt; Q3[Pollination Failure Quality : Quality]
T[Tree] --&gt; Q4[High Stress Hormone Level : Quality]
Q1 -- supports --&gt; Natural
Q2 --&gt; Premature
Q3 --&gt; Premature
Q4 --&gt; Premature
These qualities are modeled as dependent continuants that inheres_in the respective material
entities (fruit and tree). They are conferred_by various underlying biological and environmental
processes (not explicitly modeled here for brevity). For instance, maturity is conferred by
developmental processes, while high stress hormone levels can be conferred by environmental
stressors like drought or pest infestation.
5. Modeling Human Classification as an Information
Artifact
To reconcile this realist ontological model with human classification practices, we propose
modeling the classification itself not as an ontological distinction in the process, but as a
cognitive and informational process that results in an information artifact: a label.
Code snippet
flowchart TD
subgraph Configuration
C1[Fruit Drop Context : Snapshot of Participant Qualities]
end
subgraph Classifier
CF[Fruit Drop Classification Function : Cognitive Process]
end
C1 -- has_input --&gt; CF
CF -- has_output --&gt; L1[Natural Fruit Drop Label : Information Artifact]
CF -- has_output --&gt; L2[Premature Fruit Drop Label : Information
Artifact]
Here, the Fruit Drop Context is conceived as a specific configuration of the relevant qualities
of the participating entities at or leading up to the fruit drop event. This &quot;snapshot&quot; represents a
specific instantiation of the qualities discussed in the previous section and can be considered an
occurrent (a specific state of affairs at a given time). The Fruit Drop Classification
Function represents the cognitive process (or potentially an automated algorithm) that takes this
context as input and outputs a classification label (&quot;Natural Fruit Drop&quot; or &quot;Premature Fruit
Drop&quot;), which is an Information Artifact.
6. Final BFO-Aligned Model
Integrating these components yields the following BFO-aligned model:

Code snippet
flowchart TD
F[Fruit : Material Entity] --&gt; Q1[Maturity Quality : Quality]
F --&gt; Q2[Pollination Quality : Quality]
T[Tree : Material Entity] --&gt; Q3[Stress Level Quality : Quality]
Q1 &amp; Q2 &amp; Q3 --&gt; C1[Fruit Drop Context : Occurrent]
P[Fruit Drop Process : Process] -- has_participant --&gt; F
P -- has_participant --&gt; T
P -- occurs_in --&gt; C1
C1 -- has_input --&gt; CF[Classification Function : Cognitive Process]
CF -- has_output --&gt; IA[Natural or Premature Label : Information
Artifact]
In this comprehensive model:
 The Fruit Drop Process remains a single ontological kind, characterized by its
constituent subprocesses and participating entities.
 The specific configuration of relevant Quality instances (Maturity
Quality, Pollination Quality, Stress Level Quality) at the time of the event
constitutes the Fruit Drop Context.
 This Fruit Drop Context (occurs_in the process or is the immediate background
against which it unfolds) serves as the input to a Classification Function.
 The Classification Function outputs an Information Artifact – the &quot;Natural&quot; or
&quot;Premature&quot; label – reflecting human interpretation based on the contextual factors.
This approach explicitly acknowledges that the classification is a secondary process of
interpretation and labeling, not an inherent difference in the fundamental ontological nature of
the fruit drop event itself.
7. Benefits of the Approach
This BFO-aligned model offers several key benefits:
 Maintains Realist Discipline: It avoids introducing false ontological distinctions based
on human interpretation, adhering to the principle that processes are individuated by their
intrinsic nature.
 Supports Domain Needs: It effectively accommodates human classification needs and
semantic distinctions used in scientific and agricultural discourse by modeling these as
arising from contextual factors and interpretive processes.
 Extensible: This pattern can be readily extended to other domains (e.g., medical
diagnoses of &quot;normal&quot; vs. &quot;pathological&quot; physiological processes, environmental
classifications of &quot;natural&quot; vs. &quot;anthropogenic&quot; events, or even sociotechnical systems
where human actions are classified based on context) where similar tensions between
ontological reality and human categorization exist.

 Enhanced Knowledge Representation: By explicitly separating the ontological process
from its human classification, this model allows for more accurate and flexible
knowledge representation. Queries can focus on the fundamental process while still
allowing for filtering and categorization based on the relevant contextual qualities and
their associated labels. This can improve reasoning and data integration across different
datasets that might use different labeling conventions.
8. Conclusion
Realist ontologies like BFO provide a powerful foundation for modeling the complexities of the
life sciences. However, effective application requires careful consideration of how human
conceptual systems interact with this underlying reality. Our proposed model offers a principled
approach to handling context-sensitive process classification by grounding the ontological
representation in BFO’s rigorous framework while explicitly modeling human interpretation as a
separate, information-generating process based on participant qualities and their configurations.
This balance between ontological realism and pragmatic semantic needs is crucial for building
robust and interoperable ontology-based knowledge systems in the life sciences and beyond.
References
 Smith, B., Ceusters, W., Klagges, B., Köhler, J., Kumar, A., Lomax, J., ... &amp; Rosse, C.
(2005). Relations in biomedical ontologies. Genome Biology, 6(5), R46.  1    

1. run.unl.pt 

run.unl.pt

 Grenon, P., &amp; Smith, B. (2004). SNAP and SPAN: Towards Dynamic Spatial
Ontology. Spatial Cognition &amp; Computation, 4(1), 69–103.
 Arp, R., Smith, B., &amp; Spear, A. D. (2015). Building Ontologies with Basic Formal
Ontology. MIT Press.
