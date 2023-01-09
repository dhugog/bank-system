import { Divider, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Item {
  id: number;
  description: string;
  amount: number;
  date: string;
}

interface Props {
  items: Array<Item>;
  onSelect?: (item: Item) => void;
  onNext?: () => void;
  hasMore?: boolean;
}

const PaginatedList = ({ items, onSelect, onNext, hasMore }: Props) => {
  return (
    <>
      {items.length === 0 && (
        <Typography color="primary" textAlign="center" fontWeight="bold" m={1}>
          No data found.
        </Typography>
      )}

      {items.length > 0 && (
        <List>
          <InfiniteScroll
            dataLength={items.length}
            next={() => (onNext ? onNext() : null)}
            hasMore={hasMore ?? false}
            loader={<h4>Loading...</h4>}
          >
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  style={{ cursor: onSelect ? "pointer" : "default" }}
                  onClick={() => (onSelect ? onSelect(item) : null)}
                  secondaryAction={
                    <Typography color={item.amount < 0 ? "error" : "primary"}>
                      {(item.amount / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </Typography>
                  }
                >
                  <ListItemText
                    color="primary"
                    primary={
                      <React.Fragment>
                        <Typography color="primary" fontWeight="bold">
                          {item.description}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="primary"
                        >
                          {new Date(item.date).toLocaleDateString()},{" "}
                          {new Date(item.date).toLocaleTimeString()}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider light />
              </React.Fragment>
            ))}
          </InfiniteScroll>
        </List>
      )}
    </>
  );
};

export default PaginatedList;
