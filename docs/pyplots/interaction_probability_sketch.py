import matplotlib.pyplot as plt
import numpy as np
from matplotlib.axes import Axes


def exponential(a: float, b: float):
    def wrapper(xs):
        return a * np.exp(b * xs)

    return wrapper


def exponential_sketch(ax, a, b, xlabel, ylabel):
    ax.plot(xs, exponential(a, b)(xs))
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.tick_params(
        bottom=False, labelbottom=False, right=False, left=False, labelleft=False
    )


def interaction(ax: Axes):
    return exponential_sketch(ax, 10, 0.7, "distance", "Number of interactions")


def probability(ax: Axes):
    return exponential_sketch(
        ax, 0.088, -1.5, "distance", "Infection chance per interaction"
    )


xs = np.arange(0, 3, 0.1)
fig, axs = plt.subplots(1, 2)
fig.set_size_inches(10, 4)

interaction(axs[0])
probability(axs[1])
plt.show()
