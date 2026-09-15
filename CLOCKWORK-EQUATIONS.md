# Clock of Primes: geometry written as equations

This describes the implemented model, in the standard reflected orientation
(real right, imaginary up), with the original linear radial ruler. The clock's
time T and the complex parameter s=σ+iτ are independent variables. The clock
radius is R; dividing screen distances by R makes the rim a unit circle.

## 1. The second hand

Let {T}=T−floor(T). Its rim position is

    B(T) = R exp(2π i T).

One unit of T is one complete turn, and every integer beat returns to the
positive real meeting ray. In the original orientation the same geometry is
reflected: the meeting ray points upward.

## 2. Birth, growth and movement of a pane

A pane has an integer label q. The ordinary rings are primes; the glass model
also supplies q=p^k for every prime power reached by the clock. Its base colour
and its contribution to factorization belong to p, even when q is 4, 8, 9, etc.

For T≥q, set

    r_q(T) = R q/T,
    g_q(T) = min(1,max(0,T−q)),
    φ_q(T) = 2π T/q.

Angles are interpreted modulo 2π. The complete arc is the point set

    A_q(T) = { r_q(T) exp(i[φ_q(T) − (2π/q)g_q(T)u]) : 0≤u≤1 }.

Before T=q there is no pane. At birth it is a point on the rim. Over the next
beat its angular width grows from zero to 2π/q. Its leading edge turns once in
q beats. The midpoint angle is φ_q−πg_q/q.

The sector visual is the same angular interval with radial coordinate
0≤ρ≤r_q. Prime-power sectors may be hidden by a display setting; their arithmetic
identities are still recorded.

In this ruler,

    dr_q/dT = −r_q/T,        dφ_q/dT = 2π/q.

Thus the rings all contract at the same relative rate. Once grown, every pane
has the SAME arc length at a fixed clock time:

    L_q = r_q(2π/q) = 2πR/T.

Its sector occupies fraction 1/q of its own disk. The complementary fraction
is 1−1/q. For a prime q=p, this agrees with 1−p^(−s) at s=1 only; it is not that
complex factor for arbitrary σ,τ. The absolute grown sector area is πR²q/T².

## 3. Integer meetings and factorization

The leading edge meets the positive real ray precisely when T is a multiple
of q. At an integer beat n, the panes used for FTA are

    q=p^k with q | n.

This is a test of exact divisibility, not an interpretation of every sector
that happens to overlap a ray between integer beats. The number of crossed
p-family panes is

    v_p(n) = sum over k≥1 of 1_{p^k divides n},
    n = product over primes p of p^[v_p(n)].

At n=12 the crossed labels are 2,3,4. Their base factors are 2,3,2. Pane 4 supplies
another 2, not a separate factor 4.

## 4. The glass and complex weights

The scalar transmission assigned to each p-family pane is p^(−σ). Hence the
factorized transmission at the integer meeting ray is

    product over q=p^k | n of p^(−σ) = n^(−σ).

More precisely, the implementation uses linear RGB transmissions

    T_(p,j) = exp[−3σ log(p) a_j / (a_R+a_G+a_B)],
    a_j = 1 − hueRGB(p)_j.

The geometric mean of the three channels is p^(−σ). Multiplying crossed panes
channel by channel produces geometric mean n^(−σ). Display gamma and brightened
tape ink mean ordinary screen brightness is not this scalar quantity.

The complex-vector layer attaches

    a_n(s) = n^(−s) = exp(−σ log n) exp(−iτ log n).

Length is n^(−σ); angle is −τ log n. Thus

    ∂ log|a_n|/∂σ = −log n,     ∂ arg(a_n)/∂τ = −log n.

The mechanical angular rate 2π/q and the complex phase rate −log n are different
rules. The current model does not derive one from the other. In the linear
ruler a possible bridge is r_n/r_1=n, giving log(r_n/r_1)=log n independently of
T. For composite n without a ring, r_n denotes its location on the counting
ruler rather than an extra physical pane. Turning that logarithmic measurement
into a compelling clock geometry remains open.

## 5. The two finite paths

At N=floor(T), α=T−N, the continuously arriving sum is

    S(T,s) = sum(n=1..N) n^(−s) + α(N+1)^(−s).

The graph joins its partial sums tip to tail. Its first completed term is S₁=1;
the empty sum S₀=0 is a different anchor.

At integer N the product is

    P_N(s) = product(p≤N, p prime) [1−p^(−s)]^(−1),    P₁=1.

When N+1 is prime, the arrival animation multiplies by
exp(α Log([1−(N+1)^(−s)]^(−1))); otherwise it stays at P_N. The current supported
σ>0 keeps each prime's geometric expansion absolutely convergent.

For a finite set of primes, P_N expands into ALL integers whose prime factors
are ≤N, including integers much larger than N. It is not equal to S_N. As N→∞,
both approach ζ(s) when σ>1. Inside the critical strip the gold ζ curve uses
analytic continuation; the raw infinite sum/product are not its convergent
construction there.

## 6. Optional radial rulers

The exact implemented radial view can blend away from the linear ruler. Write
λ=spacingMix, μ=radialMix, h=clamp(T−2,0,1), and L=log(max(T,2.0001)). Then

    r_original/R = (1−λ)q/T + λ log(max(2,q))/L,
    r_outward/R  = clamp[log(max(T,2.0001)/q) / log(max(T,2.0001)/2), 0,1],
    r_display   = r_original + μh(r_outward−r_original).

These change displayed distances, not periods, pane growth or exact divisibility.
The simple r_q=Rq/T and equal arc-length statements above apply to λ=μ=0.

## 7. The proposed output shift

The new opt-in overlay uses

    w = z−1,                  screen displacement = R w,
    w_ζ(s)=ζ(s)−1,            w_sum=S(T,s)−1,     w_product=P(T,s)−1.

Consequently:

- Output 1 is at the clock axle: the first sum term and empty product coincide.
- Output 0 is at w=−1, the negative-real rim point in the standard orientation.
- Every ζ zero maps to that SAME rim point. Other points of the rim are not
  generally zeros; |ζ−1|=1 alone is insufficient.
- The sum's initial segment runs from the rim (S₀=0) to the axle (S₁=1).
- The pole remains unbounded: subtracting 1 cannot bring an infinite output
  to a finite centre. Input s=1 is where the pole occurs, not its output value.

Shifting the INPUT u=s−1 would instead put the pole's input at u=0, but a zero
ρ=β+iγ would be at u=(β−1)+iγ, generally nowhere near the unit rim. These are
separate transformations. A reciprocal transformation could bring an infinite
output to the centre, but would change the sum/product geometry.

The overlay keeps one output unit equal to R, independently of the side plot's
zoom. Curves beyond the clock canvas are clipped, not squeezed inside the rim.
It shares the clock's reflection setting, fades on/off, and does not change T,
σ,τ or the user's graph view.

References for ζ's convergence, continuation, pole and Euler–Maclaurin formulas:
[NIST DLMF §25.2](https://dlmf.nist.gov/25.2). The mechanical and rendering equations
above are transcribed from the local implementation.
