===============================
Mathematical Model
===============================
*Crown's Dilemma* is using a (very) simplified version of models that are also used by scientists to predict the
spread and outcome of virus infections.

In essence, the infection rate of a virus can be expressed as the average number of people that are infected by a single
infected person :math:`R_0`

.. math::

  R_0=I \cdot P \cdot t_{infectious}

.. list-table::

  * - :math:`R_0`
    - Infection rate number
  * - :math:`I`
    - Number of interactions that an infected person has with other people per unit of time (days)
  * - :math:`P`
    - Average chance to infect someone upon interaction
  * - :math:`t_{infectious}`
    - The time someone is infectious (days)

An interaction is defined as two people spending some time within a certain distance from each other. The amount of time
and distance can be specified later. In the simulation, measures can be taken that decrease either :math:`I` or
:math:`P`

For our model, we want to express the daily infection rate:

.. math::

  R_{0,daily} = I \cdot P

At every day during our simulations, new people are infected according to this rate, in which the final term
is a rate limiting term, only interactions with an uninfected person can lead to a new infection, people cannot be
infected twice:

.. math::

  \Psi =  R_{0,daily} \cdot N_{infectious} \cdot \frac{N_{uninfected}}{N_{total}}

.. list-table::

  * - :math:`\Psi`
    - New, daily, infections
  * - :math:`N_{infectious}`
    - Number of people that can infect others
  * - :math:`N_{uninfected}`
    - Number of uninfected, susceptible people
  * - :math:`N_{total}`
    - Total population

Once infected, people enter the incubation period. In this period they do not show any symptoms, **and for simplicity**
also are not considered infectious. The incubation time is currently assumed to be constant as
:math:`t_{incubation} = 7 \: \text{days}`, future versions of the model may introduce a distribution for :math:`t_{incubation}`.

After the incubation time has expired, people become sick for a number of days. Again, assumed to be constant as
:math:`t_{sick} = 7 \: \text{days}`. During the sick period, people are infectious :math:`N_{infectious} = N_{sick}`. After the
sick period, people are cured and are no longer considered susceptible to The Virus. The total population is thus
made up of

.. math::

    N_{total} = N_{uninfected} + N_{infected} + N_{sick} + N_{cured}

and the flow of people through the different stages of infection:

.. math::
    N_{uninfected} \;\; \underrightarrow{\Psi} \;\; N_{infected} \;\;
    \underrightarrow{t_{incubation}} \;\; N_{sick} \;\; \underrightarrow{t_{sick}} \;\: N_{cured}

.. list-table::

  * - :math:`N_{infected}`
    - Number of people that have been infected but do not show symptoms yet
  * - :math:`N_{sick}`
    - Number of people that are sick and infectious
  * - :math:`N_{cured}`
    - Number of people that have been cured of the disease. They are now considered immune to further
      infection


##################################################
Determining the Interaction and Probability curves
##################################################

The measures that can be taken to prevent further spreading of The Virus, all decrease either :math:`I` or :math:`P`. Up
until now, we've assumed :math:`I` and :math:`P` are constants, or at least that the infection probability :math:`P`
is equal for all types of interactions :math:`I`. In reality, this is not correct. One of the most important parameters
that govern the infection chance is the distance between the infected and the uninfected person when the interaction
takes place: the chance of infection decreases as the distance between the two people increases. On the other hand, a
person has more interactions with other people at larger distances, than with people at smaller distances. Both are
therefore a function of the distance :math:`s`: and the daily infection rate becomes

.. math::

  R_{0,daily} = \int{I(s) \cdot P(s)} \:ds

.. list-table::

  * - :math:`s`
    - Distance at which the interaction takes place (m)

The effect of distance is sketched in figure 1. The exact shape of the curves is chosen arbitrary.

.. plot:: pyplots/interaction_probability_sketch.py

  Figure 1: Left) number of interaction increases with distance. Right) infection chance decreases with distance

As stated above, the infection chance :math:`P` is also affected by the duration of the interaction, but this is
ignored for our model. Furthermore, we set an upper limit at which interactions no longer have a chance to cause
an infection at :math:`s=3 \: \text{m}`

Now let's have a look at what these curves look like in the model

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Determining the Interaction curve
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

With a couple of (arbitrary) assumptions, we can estimate what the Interaction curve :math:`I(s)` looks like:

- The number of interactions is exponentially increasing over the domain :math:`0 \leq s \leq 3`:

.. math::

  I(s) = \alpha_1 \cdot e^{\beta_1 \cdot s}

- By default, people have interactions with approximately 100 people every day. This includes eg. conversations,
  passing people on the sidewalk and hugs
- 10 of these interactions involve human contact

:math:`\alpha_1` can be determined from the last assumption

.. math::

  I(0) = \alpha_1 \cdot e^{\beta_1 \cdot 0} = 10 \\
  \alpha_1 \cdot 1 = 10 \\
  \alpha_1 = 10 \\

Determining :math:`\beta_1` requires an integration step:

.. math::
  \intop_{0}^{3} 10 \cdot e^{\beta_1 \cdot s}\: ds = 100 \\
  \beta_1 \approx 0.7

The final curve for the number of daily interactions becomes

.. math::
  I(s) = 10 \cdot e^{0.7 \cdot s} \; \text{with} \; 0 \leq s \leq 3

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Determining the Probability curve
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

In a similar way, we can determine the Probability curve :math:`P(s)`. We state the following
assumptions:

- The infection probability is decreasing exponentially over the domain :math:`0 \leq s \leq 3`:

.. math::

  P(s) = \alpha_2 \cdot e^{-\beta_2 \cdot s}

- The probability of infection at :math:`s=3` is 100 times smaller than at :math:`s=0`

.. math::

  \frac{P(0)}{P(3)} = 100

- Without *any* measures taken the base infection number is about :math:`R_0=7`, which means that with an
  average :math:`t_{infectious}=7 \: \text{days}` it follows that :math:`R_{0,daily}=1` and that

.. math::

  R_{0,daily} = \intop_{0}^{3} I(s) \cdot P(s) \:ds = 1

Combining the first and second assumption gives us

.. math::
  \frac{P(0)}{P(3)} = \frac{\alpha_2 \cdot e^{-\beta_2 \cdot 0}}{\alpha_2 \cdot e^{-\beta_2 \cdot 3}} = 100 \\
  \frac{e^{-\beta_2 \cdot 0}}{e^{-\beta_2 \cdot 3}} = 100 \\
  \frac{1}{e^{-\beta_2 \cdot 3}} = 100 \\
  e^{-\beta_2 \cdot 3} = \frac{1}{100} \\
  \beta_2 = -\frac{1}{3}\ \cdot ln{ \frac{1}{100} } \approx -1.5

The third assumption gives us the value for :math:`\alpha_2`:

.. math::
  \intop_{0}^{3} I(s) \cdot P(s) \:ds = 1 \\
  \intop_{0}^{3} 10 \cdot e^{0.7 \cdot s} \cdot \alpha_2 \cdot e^{-1.5 \cdot s} \:ds = 1 \\
  \intop_{0}^{3} 10 \cdot \alpha_2 \cdot e^{(0.7 - 1.5) \cdot s}  \:ds = 1 \\
  \alpha_2 \intop_{0}^{3} 10 \cdot e^{(0.7 - 1.5) \cdot s}  \:ds = 1 \\
  \alpha_2 \approx 0.088

The final curve for the infection probability becomes

.. math::
  P(s) = 0.088 \cdot e^{-1.5 \cdot s} \; \text{with} \; 0 \leq s \leq 3