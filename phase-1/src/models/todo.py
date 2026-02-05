from dataclasses import dataclass, field


@dataclass
class Todo:
    id: int
    title: str
    description: str = ""
    status: str = "pending"


@dataclass
class TodoCollection:
    items: dict[int, Todo] = field(default_factory=dict)
    next_id: int = 1
